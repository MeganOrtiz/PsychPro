---
name: Preserve study work during loading recovery
description: Reliability decisions for failed reads, page updates, and shared catalog load.
---

Do not recover a page-load or chunk failure by automatically reloading the whole
application, and do not automatically replay writes after a network failure.

**Why:** A full reload can discard an active quiz, exam, upload form, or note draft.
A timed-out write may already have succeeded on the server. Recovery must not
create duplicate submissions or payments.

**How to apply:** Use bounded recovery for read-only requests and route imports,
then expose an explicit retry/refresh action. Keep existing study data visible
when a background read fails.

Avoid per-topic count-query fan-out on shared catalog endpoints.

**Why:** The reliability investigation found that a catalog of only 44 topics
already generated 89 queries. That load competes with profile and access requests
for the same pool, making unrelated navigation appear intermittently stuck.

**How to apply:** Aggregate counts in grouped reads; compare the complete response
before and after an optimization rather than accepting faster but incomplete data.
