/**
 * Mortality-curve tuning. Targets from the spec:
 *   median death ~ age 31-35, age 50+ a good run (~15%), age 70+ rare (~1-2%).
 * These constants are theme-agnostic defaults; a theme may override via config.
 */
import type { BalanceConfig, Build, ThemeConfig } from "./types.js";
import { simulate } from "./simulate.js";

export const DEFAULT_BALANCE: BalanceConfig = {
  yearlyEventRate: 0.55,
  ageHazardBase: 0.0015,
  ageHazardGrowth: 0.0000175,
  ageHazardExp: 2,
  mitigationScale: 0.06,
  fatalScale: 0.62,
};

export interface Distribution {
  runs: number;
  median: number;
  mean: number;
  p10: number;
  p90: number;
  pctOver50: number;
  pctOver70: number;
  min: number;
  max: number;
}

/** Run a build across many seeds and summarise the age-at-death distribution. */
export function distribution(
  build: Build,
  theme: ThemeConfig,
  runs = 20000,
  seedPrefix = "bal",
): Distribution {
  const ages: number[] = [];
  for (let i = 0; i < runs; i++) {
    ages.push(simulate(build, `${seedPrefix}-${i}`, theme).ageAtDeath);
  }
  ages.sort((a, b) => a - b);
  const at = (q: number) => ages[Math.min(ages.length - 1, Math.floor(q * ages.length))]!;
  const mean = ages.reduce((s, a) => s + a, 0) / ages.length;
  return {
    runs,
    median: at(0.5),
    mean: Math.round(mean * 10) / 10,
    p10: at(0.1),
    p90: at(0.9),
    pctOver50: Math.round((ages.filter((a) => a >= 50).length / runs) * 1000) / 10,
    pctOver70: Math.round((ages.filter((a) => a >= 70).length / runs) * 1000) / 10,
    min: ages[0]!,
    max: ages[ages.length - 1]!,
  };
}
