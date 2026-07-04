import type { ThemeConfig } from "../../../engine/types.js";
import { DEFAULT_BALANCE } from "../../../engine/balance.js";
import { ALL_CHOICES, GACHA } from "./choices.js";
import { EVENTS } from "./events/index.js";
import { DEATHS } from "./deaths.js";
import { BADGES } from "./badges.js";
import { generateName } from "./names.js";
import { buildWorld } from "./world.js";

export const peasantTheme: ThemeConfig = {
  id: "peasant",
  startAge: 12,
  maxAge: 80,
  statKeys: ["health", "wealth", "standing", "suspicion"],
  startStats: { health: 4, wealth: 2, standing: 3, suspicion: 0 },
  slots: [
    { id: "trade", label: "Trade" },
    { id: "village", label: "Village" },
    { id: "lord", label: "Lord" },
    { id: "item", label: "Item" },
  ],
  scoreLabel: "Age at Death",
  scoreUnit: "years",
  winThreshold: 70,
  winLabel: "A Good Death",
  balance: DEFAULT_BALANCE,
  options: ALL_CHOICES,
  gacha: GACHA,
  events: EVENTS,
  deaths: DEATHS,
  badges: BADGES,
  generateName,
  buildWorld,
};

export { renderParishRecord } from "./record.js";
export { worldHeadline } from "./world.js";
export {
  TRADES,
  VILLAGES,
  LORDS,
  ITEMS,
  GACHA,
  RARITY_TIER_PROB,
} from "./choices.js";
