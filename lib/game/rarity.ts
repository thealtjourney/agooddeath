/**
 * Badge rarity service.
 *
 * Rarity ("earned by 2.1% of peasants") is a GLOBAL number — it needs a shared
 * counter across all players, i.e. a backend. This module defines the contract
 * and ships a realistic MOCK so the UI is complete today. Swap `mockRarity` for
 * `apiRarity` when Tier-B lands.
 *
 * Backend contract (Tier B, Supabase or similar):
 *   GET  /api/badges            -> { total: number, holders: Record<id, number> }
 *   POST /api/badges/report     <- { build, seed, badgeIds }
 *     The server RE-SIMULATES simulate(build, seed) and awardBadges() to verify
 *     each claimed badge before incrementing its holder count. Client-submitted
 *     badge lists are never trusted — this is what keeps rarity un-forgeable.
 *   Idempotency: report is keyed by (anonId, badgeId) so replays don't inflate.
 */
import { hashSeed } from "../engine/rng.js";
import { theme } from "./theme-ui.js";

export interface BadgeRarity {
  badgeId: string;
  holders: number;
  total: number;
  pct: number; // 0..100, holders/total
}

export interface RarityService {
  getAll(): Promise<Record<string, BadgeRarity>>;
  report(badgeIds: string[]): Promise<void>;
}

const MOCK_TOTAL = 128_450;

/** Deterministic pseudo-global counts derived from each badge's designed rarity. */
function mockRarities(): Record<string, BadgeRarity> {
  const out: Record<string, BadgeRarity> = {};
  for (const b of theme.badges) {
    const jitter = 0.92 + (hashSeed(b.id) % 1000) / 6250; // ~0.92..1.08
    const holders = Math.max(1, Math.round(MOCK_TOTAL * b.baseRarity * jitter));
    const clamped = Math.min(holders, MOCK_TOTAL);
    out[b.id] = {
      badgeId: b.id,
      holders: clamped,
      total: MOCK_TOTAL,
      pct: Math.round((clamped / MOCK_TOTAL) * 1000) / 10,
    };
  }
  return out;
}

export const mockRarity: RarityService = {
  async getAll() {
    return mockRarities();
  },
  async report() {
    /* no-op in mock — the real service verifies + increments server-side */
  },
};

/** Real service, enabled once /api/badges exists. */
export const apiRarity: RarityService = {
  async getAll() {
    const r = await fetch("/api/badges", { cache: "no-store" });
    const { total, holders } = (await r.json()) as {
      total: number;
      holders: Record<string, number>;
    };
    const out: Record<string, BadgeRarity> = {};
    for (const b of theme.badges) {
      const h = holders[b.id] ?? 0;
      out[b.id] = {
        badgeId: b.id,
        holders: h,
        total,
        pct: total > 0 ? Math.round((h / total) * 1000) / 10 : 0,
      };
    }
    return out;
  },
  async report(badgeIds) {
    // build + seed are attached by the caller in the real implementation
    await fetch("/api/badges/report", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ badgeIds }),
    }).catch(() => {});
  },
};

/** Active service. Flip to apiRarity when the backend is live. */
export const rarityService: RarityService = mockRarity;

/** Human label for a rarity, e.g. "2.1% · 2,698 souls". */
export function rarityLabel(r: BadgeRarity | undefined): string {
  if (!r) return "—";
  const pct = r.pct < 0.1 ? "<0.1%" : `${r.pct}%`;
  return `${pct} · ${r.holders.toLocaleString("en-GB")} souls`;
}
