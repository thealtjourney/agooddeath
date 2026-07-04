"use client";

import { getAnonId } from "./identity.js";

export interface LbEntry {
  name: string;
  age: number;
  build: string;
}

export interface LbData {
  configured: boolean;
  top: LbEntry[];
  total: number;
  you: { rank: number; age: number } | null;
}

export interface SubmitResult {
  configured: boolean;
  age?: number;
  best_age?: number;
  rank?: number;
  total?: number;
  is_new_best?: boolean;
}

export async function submitDailyRun(
  seed: string,
  b: string,
  name: string,
): Promise<SubmitResult | null> {
  try {
    const res = await fetch("/api/leaderboard/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ seed, b, name, anonId: getAnonId() }),
    });
    if (!res.ok && res.status !== 200) return { configured: res.status !== 503 };
    return (await res.json()) as SubmitResult;
  } catch {
    return null;
  }
}

export async function fetchLeaderboard(seed: string): Promise<LbData> {
  try {
    const res = await fetch(
      `/api/leaderboard?seed=${encodeURIComponent(seed)}&anonId=${encodeURIComponent(getAnonId())}`,
    );
    return (await res.json()) as LbData;
  } catch {
    return { configured: false, top: [], total: 0, you: null };
  }
}
