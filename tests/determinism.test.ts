import { describe, it, expect } from "vitest";
import { simulate } from "../lib/engine/simulate.js";
import type { Build } from "../lib/engine/types.js";
import { getTheme } from "../lib/content/themes.js";
import { makeRng } from "../lib/engine/rng.js";
import { pullGacha } from "../lib/content/themes/peasant/gacha.js";

const theme = getTheme("peasant");

const build: Build = {
  choices: { trade: "gravedigger", village: "fen", lord: "cruel", item: "horseshoe" },
  gachaId: "bezoar",
};

describe("engine determinism", () => {
  it("same build + seed => identical LifeRecord", () => {
    const a = simulate(build, "2327-07-03", theme);
    const b = simulate(build, "2327-07-03", theme);
    expect(a).toEqual(b);
  });

  it("different seeds generally differ", () => {
    const ages = new Set<number>();
    for (let i = 0; i < 50; i++) {
      ages.add(simulate(build, `seed-${i}`, theme).ageAtDeath);
    }
    // Not all 50 runs should land on the same age.
    expect(ages.size).toBeGreaterThan(5);
  });

  it("gacha pull is deterministic for a given rng seed", () => {
    const p1 = pullGacha(makeRng("gacha-seed"));
    const p2 = pullGacha(makeRng("gacha-seed"));
    expect(p1.id).toBe(p2.id);
  });

  it("death cause and age are internally consistent", () => {
    const life = simulate(build, "consistency", theme);
    expect(life.ageAtDeath).toBeGreaterThanOrEqual(theme.startAge);
    expect(life.ageAtDeath).toBeLessThanOrEqual(theme.maxAge);
    expect(life.deathText.length).toBeGreaterThan(0);
    expect(life.goodDeath).toBe(life.ageAtDeath >= theme.winThreshold);
  });
});

describe("gacha odds", () => {
  it("legendary is rare (~1%) over many pulls", () => {
    let legendary = 0;
    const N = 20000;
    for (let i = 0; i < N; i++) {
      if (pullGacha(makeRng(`pull-${i}`)).rarity === "legendary") legendary++;
    }
    const pct = legendary / N;
    expect(pct).toBeGreaterThan(0.003);
    expect(pct).toBeLessThan(0.02);
  });
});
