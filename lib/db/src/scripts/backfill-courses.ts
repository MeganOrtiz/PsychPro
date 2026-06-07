// =============================================================================
// File: lib/db/src/scripts/backfill-courses.ts
//
// Manual (dev) trigger for the shared, idempotent course backfill. The same
// logic runs automatically on api-server startup (see artifacts/api-server),
// which is what seeds PRODUCTION after a publish.
//
// Usage:
//   pnpm --filter @workspace/db exec tsx src/scripts/backfill-courses.ts
// =============================================================================

import { db, backfillCoursesFromTopics } from "../index";

async function main() {
  console.log("Starting course backfill…");
  const result = await backfillCoursesFromTopics(db);
  console.log(JSON.stringify(result, null, 2));
  console.log("Course backfill complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  });
