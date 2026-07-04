/**
 * Shareable-run URLs. A run is fully described by { build, seed }, and the sim
 * is deterministic, so a short link reproduces the exact life — including the
 * OG unfurl image, which the server recomputes from these same two values.
 */
import type { Build } from "../engine/types.js";
import { theme } from "./theme-ui.js";

export const SITE_ORIGIN = "https://agooddeath.app";

const SEP = "-";

/** Encode a build as `trade-village-lord-item-gacha` (all ids are url-safe). */
export function encodeBuild(build: Build): string {
  const parts = theme.slots.map((s) => build.choices[s.id] ?? "");
  parts.push(build.gachaId);
  return parts.join(SEP);
}

/** Decode + validate. Returns null if anything is unknown (garbage-proof). */
export function decodeBuild(param: string | null | undefined): Build | null {
  if (!param) return null;
  const parts = param.split(SEP);
  if (parts.length !== theme.slots.length + 1) return null;

  const choices: Record<string, string> = {};
  for (let i = 0; i < theme.slots.length; i++) {
    const slot = theme.slots[i]!;
    const id = parts[i]!;
    const ok = theme.options.some((o) => o.slot === slot.id && o.id === id);
    if (!ok) return null;
    choices[slot.id] = id;
  }
  const gachaId = parts[theme.slots.length]!;
  if (!theme.gacha.some((g) => g.id === gachaId)) return null;

  return { choices, gachaId };
}

/** Relative path to the replay/landing page for a run. */
export function runPath(seed: string, build: Build): string {
  return `/run/${encodeURIComponent(seed)}?b=${encodeBuild(build)}`;
}

/** Absolute URL for sharing (unfurl target). */
export function runUrl(seed: string, build: Build): string {
  return `${SITE_ORIGIN}${runPath(seed, build)}`;
}

/** Relative OG/PNG image URL — same renderer for unfurls and downloads. */
export function ogImagePath(seed: string, build: Build): string {
  return `/api/og?seed=${encodeURIComponent(seed)}&b=${encodeBuild(build)}`;
}
