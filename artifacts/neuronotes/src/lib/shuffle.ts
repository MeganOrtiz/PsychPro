/**
 * Fisher–Yates shuffle returning a new array. Replaces the biased
 * `arr.sort(() => Math.random() - 0.5)` pattern that ships a non-uniform
 * distribution and relies on undefined sort behaviour.
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
