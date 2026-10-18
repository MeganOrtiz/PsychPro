/** PostgreSQL serial IDs must be whole, positive int32 values, not parseInt prefixes. */
export function parseTopicId(raw: unknown): number | null {
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 && id <= 2_147_483_647 ? id : null;
}
