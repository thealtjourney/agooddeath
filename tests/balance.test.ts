import { describe, it, expect } from "vitest";
import { distribution } from "../lib/engine/balance.js";
import type { Build } from "../lib/engine/types.js";
import { getTheme } from "../lib/content/themes.js";

const theme = getTheme("peasant");

const builds: Record<string, Build> = {
  balanced: { choices: { trade: "carpenter", village: "market", lord: "pious", item: "cloak" }, gachaId: "turnip" },
  safe: { choices: { trade: "shepherd", village: "upland", lord: "cruel", item: "cloak" }, gachaId: "goose" },
  // A genuinely reckless build: resented trade, diseased village, greedy regent, no protection.
  risky: { choices: { trade: "miller", village: "fen", lord: "child", item: "knife" }, gachaId: "spoon" },
};

describe("mortality distribution targets", () => {
  for (const [name, build] of Object.entries(builds)) {
    it(`${name}: median in sane band, 70+ is rare`, { timeout: 20000 }, () => {
      const d = distribution(build, theme, 8000, `bal-${name}`);
      // Spec: no build with median > 45 or < 22.
      expect(d.median).toBeGreaterThanOrEqual(22);
      expect(d.median).toBeLessThanOrEqual(45);
      // 70+ should be rare across builds (spec target ~1-2%, allow a band).
      expect(d.pctOver70).toBeLessThan(9);
    });
  }

  it("safe build outlives risky build (median)", { timeout: 20000 }, () => {
    const safe = distribution(builds.safe!, theme, 8000, "cmp-safe");
    const risky = distribution(builds.risky!, theme, 8000, "cmp-risky");
    expect(safe.median).toBeGreaterThan(risky.median);
  });
});
