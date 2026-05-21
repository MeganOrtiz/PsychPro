/**
 * Reset every user row to the free, non-admin baseline so a pre-launch
 * environment can be shipped clean without deleting any of the data those
 * users created (progress, custom decks, feedback, profiles all stay
 * intact and keep pointing at the same user IDs).
 *
 * What this script DOES:
 *   - `UPDATE users SET subscription_status='free', is_admin=false`
 *     for every row in `users`.
 *
 * What this script DOES NOT do (intentionally):
 *   - It does **not** delete any rows in `users` or in any user-owned
 *     child table. If you want a hard wipe, do it manually with TRUNCATE
 *     under a different name; this script is the non-destructive path
 *     described in PUBLISHING.md.
 *   - It does **not** touch Stripe. After running this, the matching
 *     Stripe customers/subscriptions still exist; cancel them in the
 *     Stripe Dashboard before relaunch if needed.
 *
 * Gated on `CONFIRM_RESET_DEV_USERS=yes` so a stray invocation can't
 * silently flip every account back to free.
 *
 * Usage:
 *   CONFIRM_RESET_DEV_USERS=yes \
 *     pnpm --filter @workspace/scripts run reset-dev-users
 *
 * After running, re-grant admin to your real admin accounts with
 * `pnpm --filter @workspace/scripts run grant-admin <user-id>` for each
 * one.
 */
import { db, usersTable } from "@workspace/db";

async function main(): Promise<void> {
  if (process.env.CONFIRM_RESET_DEV_USERS !== "yes") {
    console.error(
      "Refusing to run. Set CONFIRM_RESET_DEV_USERS=yes to confirm you intend to reset every user to free+non-admin.",
    );
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  console.log(
    "Resetting all users to subscriptionStatus='free' and isAdmin=false…",
  );

  const updated = await db
    .update(usersTable)
    .set({ subscriptionStatus: "free", isAdmin: false })
    .returning({ id: usersTable.id });

  console.log(
    `Done. ${updated.length} user row(s) reset. Re-grant admin with \`pnpm --filter @workspace/scripts run grant-admin <user-id>\` as needed.`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
