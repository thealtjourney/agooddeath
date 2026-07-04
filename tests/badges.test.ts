import { describe, it, expect } from "vitest";
import { awardBadges } from "../lib/engine/badges.js";
import { simulate } from "../lib/engine/simulate.js";
import { getTheme } from "../lib/content/themes.js";
import type { LifeRecord } from "../lib/engine/types.js";

const theme = getTheme("peasant");

function life(partial: Partial<LifeRecord>): LifeRecord {
  return {
    seed: "t",
    build: { choices: {}, gachaId: "turnip" },
    name: "Test the Nameless",
    ageAtDeath: 30,
    deathCauseId: "the_flux",
    deathText: "died of the flux.",
    events: [],
    flags: [],
    finalStats: {},
    goodDeath: false,
    stats: { childrenSurvived: 0, plaguesEndured: 0, timesAccused: 0, yearsLived: 18 },
    ...partial,
  };
}

describe("badge evaluation", () => {
  it("everyone earns 'A Life Lived'", () => {
    const l = simulate({ choices: { trade: "carpenter", village: "market", lord: "pious", item: "cloak" }, gachaId: "turnip" }, "any-seed", theme);
    expect(awardBadges(l, theme.badges)).toContain("a_life_lived");
  });

  it("A Good Death only for 70+", () => {
    expect(awardBadges(life({ ageAtDeath: 74, goodDeath: true }), theme.badges)).toContain("a_good_death");
    expect(awardBadges(life({ ageAtDeath: 40, goodDeath: false }), theme.badges)).not.toContain("a_good_death");
  });

  it("specific-death badges fire on the right cause", () => {
    expect(awardBadges(life({ deathCauseId: "lightning_blasphemy" }), theme.badges)).toContain("smitten");
    expect(awardBadges(life({ deathCauseId: "the_flux" }), theme.badges)).not.toContain("smitten");
  });

  it("survived-a-witch-trial requires the event but not death by it", () => {
    const survived = life({
      deathCauseId: "the_flux",
      events: [{ age: 19, eventId: "witch_trial", text: "…", category: "justice", noteworthy: true }],
    });
    const burned = life({ deathCauseId: "witch_trial" });
    expect(awardBadges(survived, theme.badges)).toContain("floated_the_wrong_way");
    expect(awardBadges(burned, theme.badges)).toContain("did_not_float");
    expect(awardBadges(burned, theme.badges)).not.toContain("floated_the_wrong_way");
  });

  it("family badges scale with children", () => {
    expect(awardBadges(life({ flags: ["married"], stats: { childrenSurvived: 4, plaguesEndured: 0, timesAccused: 0, yearsLived: 30 } }), theme.badges)).toEqual(
      expect.arrayContaining(["fruitful", "full_cottage", "wed_in_the_parish", "and_the_pig"]),
    );
  });

  it("all badge icons resolve to a defined glyph key", () => {
    const known = new Set([
      "hourglass", "pig", "alone", "candle", "plague", "eye", "ring", "cradle",
      "sword", "bones", "witch", "cart", "hoof", "bolt", "noose", "indulgence",
      "laurel", "star",
    ]);
    for (const b of theme.badges) expect(known.has(b.icon)).toBe(true);
  });
});
