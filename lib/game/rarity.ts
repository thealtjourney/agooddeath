"use client";

/**
 * Badge rarity service. Rarity is a GLOBAL number, so it comes from the backend
 * (see /api/badges). Until enough players exist — or if the backend isn't
 * configured — it falls back to the designed mock so the UI always has sensible
 * numbers. Reporting sends {seed, build}; the SERVER re-simulates and computes
 * the earned badges itself, so counts can't be forged.
 */
import { hashSeed } from "../engine/rng.js";
import { theme } from "./theme-ui.js";
import { getAnonId } from "./identity.js";

export interface BadgeRarity {
  badgeId: string;
  holders: number;
  total: number;
  pct: number; // 0..100, holders/total
}

export interface RarityService {
  getAll(): Promise<Record<string, BadgeRarity>>;
  report(seed: string, b: string): Promise<void>;
}

const MOCK_TOTAL = 128_450;
/** Below this many players, show the designed mock rather than a tiny sample. */
const MIN_SAMPLE = 25;

function mockRarities(): Record<string, BadgeRarity> {
  const out: Record<string, BadgeRarity> = {};
  for (const b of theme.badges) {
    const jitter = 0.92 + (hashSeed(b.id) % 1000) / 6250;
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

function realRarities(total: number, holders: Record<string, number>): Record<string, BadgeRarity> {
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
}

export const rarityService: RarityService = {
  async getAll() {
    try {
      const res = await fetch("/api/badges", { cache: "no-store" });
      const j = (await res.json()) as {
        configured?: boolean;
        total?: number;
        holders?: Record<string, number>;
      };
      if (!j.configured || (j.total ?? 0) < MIN_SAMPLE) return mockRarities();
      return realRarities(j.total ?? 0, j.holders ?? {});
    } catch {
      return mockRarities();
    }
  },
  async report(seed, b) {
    try {
      await fetch("/api/badges/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ seed, b, anonId: getAnonId() }),
      });
    } catch {
      /* offline — ignore */
    }
  },
};

/** Human label for a rarity, e.g. "2.1% · 2,698 souls". */
export function rarityLabel(r: BadgeRarity | undefined): string {
  if (!r) return "—";
  const pct = r.pct < 0.1 ? "<0.1%" : `${r.pct}%`;
  return `${pct} · ${r.holders.toLocaleString("en-GB")} souls`;
}
