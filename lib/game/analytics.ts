"use client";

import { track } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null>;

/**
 * Thin wrapper over Vercel Web Analytics custom events. Safe to call anywhere —
 * it no-ops if analytics isn't enabled, so it never breaks the game. Basic
 * pageview traffic is captured automatically by <Analytics/>; these are the
 * game-specific events worth watching (spec §4).
 */
export function event(name: string, props?: Props): void {
  try {
    track(name, props);
  } catch {
    /* analytics unavailable — ignore */
  }
}
