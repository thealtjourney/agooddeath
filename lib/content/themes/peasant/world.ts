import type { Rng } from "../../../engine/rng.js";
import type { WorldYear } from "../../../engine/types.js";

/**
 * The seed fixes the WORLD: which years are plague years, when war breaks out,
 * harvest quality. Same seed => same world for everyone that day. The build
 * determines how you fare in it. Drawn from the rng FIRST so it's stable
 * regardless of the player's choices.
 */
export function buildWorld(rng: Rng, startAge: number, maxAge: number): WorldYear[] {
  const span = maxAge - startAge + 1;

  // Pre-roll world timelines.
  const plagueYears = new Set<number>();
  // ~2-4 plague years scattered across a lifetime
  const plagueCount = 2 + rng.int(3);
  for (let i = 0; i < plagueCount; i++) plagueYears.add(startAge + rng.int(span));

  // A war window: a contiguous 0-4 year stretch, maybe.
  let warStart = -1;
  let warLen = 0;
  if (rng.chance(0.6)) {
    warStart = startAge + rng.int(span);
    warLen = 1 + rng.int(4);
  }

  const years: WorldYear[] = [];
  for (let age = startAge; age <= maxAge; age++) {
    const flags: string[] = [];
    const mult: Record<string, number> = {};

    if (plagueYears.has(age)) {
      flags.push("plagueYear");
      mult["disease"] = 4.5;
    }
    if (warStart >= 0 && age >= warStart && age < warStart + warLen) {
      flags.push("warYear");
      mult["war"] = 3;
    }
    // harvest wobble every year
    const roll = rng.next();
    if (roll < 0.18) {
      flags.push("badHarvest");
      mult["harvest"] = (mult["harvest"] ?? 1) * 2;
    } else if (roll > 0.85) {
      flags.push("goodHarvest");
      mult["harvest"] = (mult["harvest"] ?? 1) * 0.5;
    }

    years.push({ age, flags, categoryMultipliers: mult });
  }
  return years;
}

/** The day's headline theme, for the site header. */
export function worldHeadline(world: WorldYear[]): string {
  const anyPlague = world.some((y) => y.flags.includes("plagueYear"));
  const anyWar = world.some((y) => y.flags.includes("warYear"));
  if (anyPlague && anyWar) return "It is a plague year, and war is coming. Good luck.";
  if (anyPlague) return "It is a plague year. Good luck.";
  if (anyWar) return "War is on the wind this year.";
  return "A quiet year, by the standards of the age.";
}
