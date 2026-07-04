/**
 * Theme registry + active-theme resolution. Adding a new skin = a new content
 * folder + a ThemeConfig registered here. ZERO engine changes.
 */
import type { ThemeConfig } from "../engine/types.js";
import { peasantTheme } from "./themes/peasant/index.js";

export const THEMES: Record<string, ThemeConfig> = {
  peasant: peasantTheme,
};

export const DEFAULT_THEME_ID = "peasant";

export function getTheme(id: string = DEFAULT_THEME_ID): ThemeConfig {
  const t = THEMES[id];
  if (!t) throw new Error(`Unknown theme: ${id}`);
  return t;
}
