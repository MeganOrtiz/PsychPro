/**
 * Fisher–Yates shuffle returning a new array. Replaces the biased
 * `arr.sort(() => Math.random() - 0.5)` pattern used in older code: that
 * idiom not only produces a non-uniform distribution but also yields
 * implementation-dependent behaviour because the comparator violates the
 * total-ordering contract V8's sort relies on.
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
