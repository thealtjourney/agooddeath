/**
 * UI-facing view of the active theme. Keeps components from importing content
 * internals directly, so a theme swap only touches this file.
 */
import { getTheme } from "../content/themes.js";
import {
  TRADES,
  VILLAGES,
  LORDS,
  ITEMS,
  renderParishRecord,
  worldHeadline,
} from "../content/themes/peasant/index.js";
import { pullGacha } from "../content/themes/peasant/gacha.js";
import { buildWorld } from "../content/themes/peasant/world.js";
import { makeRng } from "../engine/rng.js";
import type { ChoiceOption } from "../engine/types.js";

export const theme = getTheme("peasant");

export interface SlotView {
  id: string;
  label: string;
  options: ChoiceOption[];
}

export const SLOTS: SlotView[] = [
  { id: "trade", label: "Trade", options: TRADES },
  { id: "village", label: "Village", options: VILLAGES },
  { id: "lord", label: "Lord", options: LORDS },
  { id: "item", label: "Item", options: ITEMS },
];

export const RARITY_STYLES: Record<
  string,
  { label: string; ring: string; text: string; glow: string }
> = {
  common: { label: "Common", ring: "border-ink/30", text: "text-ink-soft", glow: "" },
  uncommon: { label: "Uncommon", ring: "border-emerald-800/50", text: "text-emerald-900", glow: "" },
  rare: { label: "Rare", ring: "border-sky-800/60", text: "text-sky-900", glow: "shadow-sky-900/20" },
  epic: { label: "Epic", ring: "border-purple-800/60", text: "text-purple-900", glow: "shadow-purple-900/30" },
  legendary: { label: "Legendary", ring: "border-gilt", text: "text-gilt", glow: "shadow-gilt/40" },
};

export { renderParishRecord, worldHeadline, pullGacha, buildWorld, makeRng };

/** The daily seed string, e.g. "2327-07-04" style — here just today's date. */
export function dailySeed(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** The day's headline, matching the exact world the sim will draw. */
export function worldHeadlineFor(seed: string): string {
  const rng = makeRng(`${theme.id}:${seed}`);
  const world = buildWorld(rng, theme.startAge, theme.maxAge);
  return worldHeadline(world);
}

/** Pretty date for the card footer, e.g. "4 July 2026". */
export function prettyDate(seed: string): string {
  const d = new Date(seed);
  if (Number.isNaN(d.getTime())) return seed;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
