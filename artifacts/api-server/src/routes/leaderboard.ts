import { createHash } from "crypto";
import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { progressTable } from "@workspace/db";
import { getUserId } from "../lib/userId";

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
    const currentUserId = getUserId(req);

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

    const entries = Array.from(byUser.entries()).map(([userId, agg]) => {
      return {
        userId,
        displayName: deriveDisplayName(userId),
        streak: computeStreakFromDates(agg.dates),
        topicsCompleted: agg.completed.size,
      };
    });

    entries.sort((a, b) => {
      if (b.topicsCompleted !== a.topicsCompleted)
        return b.topicsCompleted - a.topicsCompleted;
      if (b.streak !== a.streak) return b.streak - a.streak;
      return a.displayName.localeCompare(b.displayName);
    });

    const ranked = entries.slice(0, LEADERBOARD_LIMIT).map((e, i) => {
      const { userId, ...rest } = e;
      return {
        ...rest,
        rank: i + 1,
        isCurrentUser: userId === currentUserId,
      };
    });

    let currentUserEntry: typeof ranked[number] | null = null;
    if (currentUserId && !ranked.some((r) => r.isCurrentUser)) {
      const idx = entries.findIndex((e) => e.userId === currentUserId);
      if (idx >= 0) {
        const { userId, ...rest } = entries[idx];
        currentUserEntry = {
          ...rest,
          rank: idx + 1,
          isCurrentUser: true,
        };
      } else {
        currentUserEntry = {
          displayName: deriveDisplayName(currentUserId),
          streak: 0,
          topicsCompleted: 0,
          rank: entries.length + 1,
          isCurrentUser: true,
        };
      }
    }

    res.json({
      entries: ranked,
      currentUser: currentUserEntry,
      totalParticipants: entries.length,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting leaderboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
