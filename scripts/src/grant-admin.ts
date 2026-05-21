/**
 * Grant admin privileges to a specific user by ID.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run grant-admin <user-id>
 *
 * This script is the ONLY supported path to granting admin after the
 * dev-mode overrides were removed. Run it once for each real admin user.
 *
 * Prerequisites:
 *   - The target user has signed in at least once (so their DB row exists).
 *   - DATABASE_URL is set in the environment.
 */
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function main(): Promise<void> {
  const userId = process.argv[2];
  if (!userId) {
    console.error(
      "Usage: pnpm --filter @workspace/scripts run grant-admin <user-id>",
    );
    process.exit(1);
  }

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!existing) {
    console.error(
      `User ${userId} does not exist. Make sure they have signed in at least once.`,
    );
    process.exit(1);
  }

  const [updated] = await db
    .update(usersTable)
    .set({ isAdmin: true })
    .where(eq(usersTable.id, userId))
    .returning();

  console.log(
    `Granted admin to user ${updated.id} (${updated.email ?? "no email"}).`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
