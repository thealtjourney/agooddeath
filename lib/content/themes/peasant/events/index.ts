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
import { CHAINS } from "./chains.js";

export const EVENTS: EventDef[] = [
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
  ...CHAINS,
];
