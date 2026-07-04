import type { Rng } from "../../../engine/rng.js";
import type { GachaOption } from "../../../engine/types.js";
import { GACHA, RARITY_TIER_PROB } from "./choices.js";

/**
 * Pull one gacha item: first roll a rarity tier by the fixed odds, then pick
 * uniformly (by prob weight) within that tier. Deterministic via the passed Rng.
 */
export function pullGacha(rng: Rng): GachaOption {
  const tiers = Object.keys(RARITY_TIER_PROB) as GachaOption["rarity"][];
  const tier = rng.weighted(tiers, (t) => RARITY_TIER_PROB[t]);
  const pool = GACHA.filter((g) => g.rarity === tier);
  return rng.weighted(pool, (g) => g.prob);
}
