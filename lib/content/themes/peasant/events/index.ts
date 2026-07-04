import type { EventDef } from "../../../../engine/types.js";
import { DISEASE } from "./disease.js";
import { HARVEST } from "./harvest.js";
import { TAXES } from "./taxes.js";
import { JUSTICE } from "./justice.js";
import { WAR } from "./war.js";
import { FAMILY } from "./family.js";
import { ACCIDENT } from "./accident.js";
import { FORTUNE } from "./fortune.js";
import { LORDS_EVENTS } from "./lords.js";
import { TRADES_EVENTS } from "./trades.js";
import { VILLAGES_EVENTS } from "./villages.js";
import { RELIGION } from "./religion.js";
import { CHAINS } from "./chains.js";

const ALL: EventDef[] = [
  ...DISEASE,
  ...HARVEST,
  ...TAXES,
  ...JUSTICE,
  ...WAR,
  ...FAMILY,
  ...ACCIDENT,
  ...FORTUNE,
  ...LORDS_EVENTS,
  ...TRADES_EVENTS,
  ...VILLAGES_EVENTS,
  ...RELIGION,
  ...CHAINS,
];

/**
 * Once-per-life polish: singular, dramatic events shouldn't fire twice in one
 * life with identical wording. We mark whole "singular" categories plus any
 * raid-tagged or explicitly-listed events as oncePerLife. Recurring texture
 * (taxes, tithes, harvests) is deliberately left repeatable.
 */
const SINGULAR_CATEGORIES = new Set(["accident"]);
const SINGULAR_IDS = new Set([
  "carp_scaffold_fall", "smith_pressed_for_arms", "swine_boar", "mob_at_the_mill",
  "coast_wreck", "coast_pressed", "coast_storm", "forest_wolves", "fen_mists",
  "market_imported_fever", "trial_by_ordeal", "pilgrimage_died", "dancing_mania",
  "sanctuary", "penance_barefoot", "hermit_blessing",
]);

for (const e of ALL) {
  if (
    e.oncePerLife === undefined &&
    (SINGULAR_CATEGORIES.has(e.category) ||
      (e.tags?.includes("raid") ?? false) ||
      SINGULAR_IDS.has(e.id))
  ) {
    e.oncePerLife = true;
  }
}

export const EVENTS: EventDef[] = ALL;
