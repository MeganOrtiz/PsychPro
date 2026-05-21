import { createHash } from "crypto";
import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { progressTable, userProfilesTable } from "@workspace/db";
import { getOptionalUserId } from "../lib/userId";

const router = Router();

const COMPLETION_THRESHOLD = 70;
const LEADERBOARD_LIMIT = 50;

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

router.get("/leaderboard", async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = getOptionalUserId(req);

    // Load opt-in preferences. Default is opt-in (`true`) — the column is
    // `notNull default true` — but a user with no `user_profiles` row at all
    // is also treated as opted-in so anonymous progress keeps appearing.
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

    const rows = await db
      .select({
        userId: progressTable.userId,
        topicId: progressTable.topicId,
        score: progressTable.score,
        lastAccessed: progressTable.lastAccessed,
      })
      .from(progressTable);

    const byUser = new Map<
      string,
      { topics: Set<number>; completed: Set<number>; dates: Date[] }
    >();
    for (const r of rows) {
      let entry = byUser.get(r.userId);
      if (!entry) {
        entry = { topics: new Set(), completed: new Set(), dates: [] };
        byUser.set(r.userId, entry);
      }
      entry.topics.add(r.topicId);
      if (r.score >= COMPLETION_THRESHOLD) entry.completed.add(r.topicId);
      if (r.lastAccessed) entry.dates.push(r.lastAccessed);
    }

    // The caller's own entry is always visible to them regardless of opt-in,
    // so they can see their own progress even after opting out — but opted-
    // out users do not appear in the public ranked list or counts.
    const allEntries = Array.from(byUser.entries()).map(([userId, agg]) => ({
      userId,
      displayName: deriveDisplayName(userId),
      streak: computeStreakFromDates(agg.dates),
      topicsCompleted: agg.completed.size,
    }));

    const sortFn = (
      a: { topicsCompleted: number; streak: number; displayName: string },
      b: { topicsCompleted: number; streak: number; displayName: string },
    ) => {
      if (b.topicsCompleted !== a.topicsCompleted)
        return b.topicsCompleted - a.topicsCompleted;
      if (b.streak !== a.streak) return b.streak - a.streak;
      return a.displayName.localeCompare(b.displayName);
    };

    const publicEntries = allEntries
      .filter((e) => !optedOut.has(e.userId))
      .sort(sortFn);

    const ranked = publicEntries.slice(0, LEADERBOARD_LIMIT).map((e, i) => {
      const { userId, ...rest } = e;
      return {
        ...rest,
        rank: i + 1,
        isCurrentUser: userId === currentUserId,
      };
    });

    // `currentUser` is always populated when we can resolve the caller —
    // even if they already appear in `entries` — so the client never has
    // to scan `entries` to find their own row.
    let currentUserEntry: typeof ranked[number] | null = null;
    if (currentUserId) {
      const idx = publicEntries.findIndex((e) => e.userId === currentUserId);
      const own = allEntries.find((e) => e.userId === currentUserId);
      if (idx >= 0 && own) {
        // Opted-in caller with progress: report their rank in the public list.
        const { userId: _u, ...rest } = own;
        currentUserEntry = {
          ...rest,
          rank: idx + 1,
          isCurrentUser: true,
        };
      } else if (own) {
        // Opted-out caller with progress: compute their would-be rank
        // against the public list.
        const wouldBeRank =
          publicEntries.filter((p) => sortFn(p, own) < 0).length + 1;
        const { userId: _u, ...rest } = own;
        currentUserEntry = {
          ...rest,
          rank: wouldBeRank,
          isCurrentUser: true,
        };
      } else {
        // Caller has no progress rows yet: still echo a stub row so the
        // client can render "you're not ranked yet" without a null check.
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
