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

  // Pre-roll world timelines. Days vary a lot so each daily gauntlet differs:
  // some are plague-ridden, some war-torn, some lean, some a rare quiet age.
  const plagueYears = new Set<number>();
  const plagueCount = rng.int(5); // 0-4 plague years
  for (let i = 0; i < plagueCount; i++) plagueYears.add(startAge + rng.int(span));

  // A war window: a contiguous 1-4 year stretch, ~55% of worlds.
  let warStart = -1;
  let warLen = 0;
  if (rng.chance(0.55)) {
    warStart = startAge + rng.int(span);
    warLen = 1 + rng.int(4);
  }

  // ~30% of worlds are "lean" — famine-prone; the rest are gentler on harvests.
  const leanWorld = rng.chance(0.3);
  const badHarvestRate = leanWorld ? 0.3 : 0.1;

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
    // harvest wobble every year (lean worlds fail far more often)
    const roll = rng.next();
    if (roll < badHarvestRate) {
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

export interface WorldBriefing {
  plagues: number;
  famines: number;
  warYears: number;
  warStartAge: number | null;
}

/** Summarise a world's threats so players can strategise against them. */
export function summariseWorld(world: WorldYear[]): WorldBriefing {
  let plagues = 0;
  let famines = 0;
  let warYears = 0;
  let warStartAge: number | null = null;
  for (const y of world) {
    if (y.flags.includes("plagueYear")) plagues++;
    if (y.flags.includes("badHarvest")) famines++;
    if (y.flags.includes("warYear")) {
      warYears++;
      if (warStartAge === null) warStartAge = y.age;
    }
  }
  return { plagues, famines, warYears, warStartAge };
}

function ageBand(age: number): string {
  if (age < 20) return "your youth";
  if (age < 30) return "your twenties";
  if (age < 40) return "your thirties";
  if (age < 55) return "middle age";
  return "old age";
}

/** Human threat lines for the daily briefing, e.g. ["Two plague years", ...]. */
export function briefingLines(b: WorldBriefing): string[] {
  const lines: string[] = [];
  const num = (n: number) => ["no", "one", "two", "three", "four", "five", "six"][n] ?? `${n}`;
  if (b.plagues > 0)
    lines.push(`${cap(num(b.plagues))} plague ${b.plagues === 1 ? "year" : "years"}`);
  if (b.warStartAge !== null) lines.push(`War in ${ageBand(b.warStartAge)}`);
  if (b.famines >= 12) lines.push("Lean harvests");
  if (lines.length === 0) lines.push("A rare quiet age");
  return lines;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
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
