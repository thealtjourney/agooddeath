/**
 * Seeded PRNG. ALL randomness in the game flows through this module.
 * Never use Math.random() in game logic — it breaks the daily seed and replays.
 */

/** Hash an arbitrary string into a 32-bit seed (xmur3). */
export function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

export interface Rng {
  /** float in [0, 1) */
  next(): number;
  /** integer in [0, n) */
  int(n: number): number;
  /** float in [min, max) */
  range(min: number, max: number): number;
  /** true with probability p */
  chance(p: number): boolean;
  /** pick one element uniformly */
  pick<T>(arr: readonly T[]): T;
  /** weighted pick; weights must be >= 0 and sum > 0 */
  weighted<T>(items: readonly T[], weightOf: (t: T) => number): T;
}

/** mulberry32 — small, fast, good enough for a toy; fully deterministic. */
export function makeRng(seed: number | string): Rng {
  let a = typeof seed === "string" ? hashSeed(seed) : seed >>> 0;
  const next = (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    next,
    int: (n) => Math.floor(next() * n),
    range: (min, max) => min + next() * (max - min),
    chance: (p) => next() < p,
    pick: (arr) => arr[Math.floor(next() * arr.length)]!,
    weighted: (items, weightOf) => {
      let total = 0;
      for (const it of items) total += Math.max(0, weightOf(it));
      let r = next() * total;
      for (const it of items) {
        r -= Math.max(0, weightOf(it));
        if (r < 0) return it;
      }
      return items[items.length - 1]!;
    },
  };
  return rng;
}
