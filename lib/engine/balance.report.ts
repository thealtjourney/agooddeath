/**
 * Printable balance report. Run: npm run balance
 * Simulates several representative builds and prints the age-at-death spread.
 */
import { distribution } from "./balance.js";
import type { Build } from "./types.js";
import { getTheme } from "../content/themes.js";

const theme = getTheme("peasant");

const builds: Record<string, Build> = {
  "Carpenter / Market / Pious (balanced)": {
    choices: { trade: "carpenter", village: "market", lord: "pious", item: "cloak" },
    gachaId: "turnip",
  },
  "Shepherd / Upland / Cruel (safest)": {
    choices: { trade: "shepherd", village: "upland", lord: "cruel", item: "cloak" },
    gachaId: "goose",
  },
  "Poacher / Coastal / Crusade (risky)": {
    choices: { trade: "poacher", village: "coastal", lord: "crusade", item: "knife" },
    gachaId: "finesword",
  },
  "Miller / Fen / Child-lord (cursed)": {
    choices: { trade: "miller", village: "fen", lord: "child", item: "salt" },
    gachaId: "spoon",
  },
  "Gravedigger / Fen / Cruel + Indulgence": {
    choices: { trade: "gravedigger", village: "fen", lord: "cruel", item: "horseshoe" },
    gachaId: "indulgence",
  },
};

console.log(`\nBalance report — ${theme.id} — 30,000 runs per build\n`);
console.log(
  ["build".padEnd(42), "med", "mean", "p10", "p90", "50+%", "70+%", "max"]
    .map((s) => String(s).padStart(6))
    .join(""),
);
for (const [name, build] of Object.entries(builds)) {
  const d = distribution(build, theme, 30000, name);
  const row = [
    name.padEnd(42),
    String(d.median).padStart(6),
    String(d.mean).padStart(6),
    String(d.p10).padStart(6),
    String(d.p90).padStart(6),
    `${d.pctOver50}`.padStart(6),
    `${d.pctOver70}`.padStart(6),
    String(d.max).padStart(6),
  ].join("");
  console.log(row);
}
console.log("");
