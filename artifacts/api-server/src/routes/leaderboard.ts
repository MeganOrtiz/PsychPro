import { createHash } from "crypto";
import { Router, type Request, type Response } from "express";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { userProfilesTable } from "@workspace/db";
import { getOptionalUserId } from "../lib/userId";

const router = Router();

const COMPLETION_THRESHOLD = 70;
const LEADERBOARD_LIMIT = 50;

// The leaderboard is expensive to compute (it aggregates every user's
// progress) but does not need to be real-time. Cache the computed result in
// process for a short window so a burst of requests triggers at most one
// aggregation per window per instance. Under autoscale each instance keeps its
// own cache, which is fine — the leaderboard is eventually consistent.
const CACHE_TTL_MS = 30_000;

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function dayKey(d: Date) {
  return startOfDay(d).toISOString();
}

function computeStreakFromDates(dates: (Date | null)[]) {
  const days = new Set(
    dates.filter((d): d is Date => d != null).map((d) => dayKey(d))
  );
  let streak = 0;
  const cursor = startOfDay(new Date());
  while (days.has(cursor.toISOString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function deriveDisplayName(userId: string): string {
  const hash = createHash("sha256").update(userId).digest("hex");
  const num = parseInt(hash.slice(0, 4), 16) % 10000;
  return `Scholar ${String(num).padStart(4, "0")}`;
}

type Entry = {
  userId: string;
  displayName: string;
  streak: number;
  topicsCompleted: number;
};

type LeaderboardSnapshot = {
  computedAt: number;
  publicEntries: Entry[];
  allByUser: Map<string, Entry>;
};

const sortFn = (
  a: { topicsCompleted: number; streak: number; displayName: string },
  b: { topicsCompleted: number; streak: number; displayName: string },
) => {
  if (b.topicsCompleted !== a.topicsCompleted)
    return b.topicsCompleted - a.topicsCompleted;
  if (b.streak !== a.streak) return b.streak - a.streak;
  return a.displayName.localeCompare(b.displayName);
};

let snapshotPromise: Promise<LeaderboardSnapshot> | null = null;
let snapshot: LeaderboardSnapshot | null = null;

async function buildSnapshot(): Promise<LeaderboardSnapshot> {
  // Opt-out preferences. Default is opt-in (`true`); a user with no profile
  // row at all is also treated as opted-in.
  const profiles = await db
    .select({
      userId: userProfilesTable.userId,
      prefShowOnLeaderboard: userProfilesTable.prefShowOnLeaderboard,
    })
    .from(userProfilesTable);
  const optedOut = new Set<string>();
  for (const p of profiles) {
    if (p.prefShowOnLeaderboard === false) optedOut.add(p.userId);
  }

  // Aggregate completion counts per user in the DB (one row per user) instead
  // of streaming the whole progress table into the app and grouping in JS.
  // `topicsCompleted` counts distinct topics meeting the completion threshold.
  const completedRows = (
    await db.execute<{ userId: string; topicsCompleted: number | string }>(sql`
      SELECT
        user_id AS "userId",
        COUNT(DISTINCT topic_id) FILTER (WHERE score >= ${COMPLETION_THRESHOLD}) AS "topicsCompleted"
      FROM progress
      GROUP BY user_id
    `)
  ).rows;

  // Distinct active days per user, used to compute the daily streak in JS. One
  // row per (user, day) keeps the payload small. The day boundary matches the
  // server day used by computeStreakFromDates.
  const dayRows = (
    await db.execute<{ userId: string; day: string | Date }>(sql`
      SELECT DISTINCT user_id AS "userId", date_trunc('day', last_accessed) AS "day"
      FROM progress
    `)
  ).rows;
  const daysByUser = new Map<string, Date[]>();
  for (const row of dayRows) {
    const day = new Date(row.day as string | Date);
    const arr = daysByUser.get(row.userId);
    if (arr) arr.push(day);
    else daysByUser.set(row.userId, [day]);
  }

  const allByUser = new Map<string, Entry>();
  const allEntries: Entry[] = [];
  for (const row of completedRows) {
    const entry: Entry = {
      userId: row.userId,
      displayName: deriveDisplayName(row.userId),
      streak: computeStreakFromDates(daysByUser.get(row.userId) ?? []),
      topicsCompleted: Number(row.topicsCompleted ?? 0),
    };
    allByUser.set(row.userId, entry);
    allEntries.push(entry);
  }

  const publicEntries = allEntries
    .filter((e) => !optedOut.has(e.userId))
    .sort(sortFn);

  return { computedAt: Date.now(), publicEntries, allByUser };
}

async function getSnapshot(): Promise<LeaderboardSnapshot> {
  if (snapshot && Date.now() - snapshot.computedAt < CACHE_TTL_MS) {
    return snapshot;
  }
  // De-dupe concurrent rebuilds: the first caller past the TTL builds, others
  // await the same promise instead of each launching their own aggregation.
  if (!snapshotPromise) {
    snapshotPromise = buildSnapshot()
      .then((s) => {
        snapshot = s;
        return s;
      })
      .finally(() => {
        snapshotPromise = null;
      });
  }
  return snapshotPromise;
}

router.get("/leaderboard", async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = getOptionalUserId(req);
    const { publicEntries, allByUser } = await getSnapshot();

    const ranked = publicEntries.slice(0, LEADERBOARD_LIMIT).map((e, i) => {
      const { userId, ...rest } = e;
      return {
        ...rest,
        rank: i + 1,
        isCurrentUser: userId === currentUserId,
      };
    });

    // `currentUser` is always populated when we can resolve the caller — even
    // if they already appear in `entries` — so the client never has to scan
    // `entries` to find their own row.
    let currentUserEntry: typeof ranked[number] | null = null;
    if (currentUserId) {
      const own = allByUser.get(currentUserId);
      const idx = own
        ? publicEntries.findIndex((e) => e.userId === currentUserId)
        : -1;
      if (idx >= 0 && own) {
        // Opted-in caller with progress: report their rank in the public list.
        const { userId: _u, ...rest } = own;
        currentUserEntry = { ...rest, rank: idx + 1, isCurrentUser: true };
      } else if (own) {
        // Opted-out caller with progress: compute their would-be rank against
        // the public list.
        const wouldBeRank =
          publicEntries.filter((p) => sortFn(p, own) < 0).length + 1;
        const { userId: _u, ...rest } = own;
        currentUserEntry = { ...rest, rank: wouldBeRank, isCurrentUser: true };
      } else {
        // Caller has no progress rows yet: still echo a stub row so the client
        // can render "you're not ranked yet" without a null check.
        currentUserEntry = {
          displayName: deriveDisplayName(currentUserId),
          streak: 0,
          topicsCompleted: 0,
          rank: publicEntries.length + 1,
          isCurrentUser: true,
        };
      }
    }

    res.json({
      entries: ranked,
      currentUser: currentUserEntry,
      totalParticipants: publicEntries.length,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting leaderboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
