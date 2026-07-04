import type { Rng } from "../../../engine/rng.js";
import type { Build } from "../../../engine/types.js";
import { TRADES, VILLAGES } from "./choices.js";

const FIRST_NAMES = [
  "Wat", "Agnes", "Godwin", "Alys", "Piers", "Maud", "Hob", "Cecily",
  "Tibb", "Joan", "Osbert", "Edith", "Cuthbert", "Milburga", "Roger",
  "Isolde", "Gervase", "Petronilla", "Dunstan", "Sibbald",
];

/** Medieval first name + trade/village epithet, e.g. "Wat the Gravedigger". */
export function generateName(rng: Rng, build: Build): string {
  const first = rng.pick(FIRST_NAMES);
  const trade = TRADES.find((t) => t.id === build.choices["trade"]);
  const village = VILLAGES.find((v) => v.id === build.choices["village"]);
  const epithet = trade ? `the ${trade.label}` : "the Nameless";
  const of = village ? `, of ${village.label}` : "";
  return `${first} ${epithet}${of}`;
}
