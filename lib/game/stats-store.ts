"use client";

/**
 * Personal play stats: best age, lives lived, and a daily streak. Local-only
 * (no account). The daily streak counts consecutive calendar days on which the
 * player completed that day's daily seed.
 */
const KEY = "agd:stats:v1";

export interface PlayStats {
  bestAge: number;
  runs: number;
  streak: number;
  lastDailyDate?: string; // ISO yyyy-mm-dd of last completed daily
}

const EMPTY: PlayStats = { bestAge: 0, runs: 0, streak: 0 };

export function loadStats(): PlayStats {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const p = JSON.parse(raw) as PlayStats;
    return {
      bestAge: p.bestAge ?? 0,
      runs: p.runs ?? 0,
      streak: p.streak ?? 0,
      lastDailyDate: p.lastDailyDate,
    };
  } catch {
    return { ...EMPTY };
  }
}

function save(s: PlayStats): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage blocked */
  }
}

function yesterdayOf(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Record a finished run. `dailyDate` is set only when this was that day's daily
 * seed (i.e. seed === today's date). Streak advances once per calendar day.
 */
export function recordResult(opts: {
  age: number;
  dailyDate?: string;
}): { stats: PlayStats; isNewBest: boolean } {
  const s = loadStats();
  const isNewBest = opts.age > s.bestAge;
  if (isNewBest) s.bestAge = opts.age;
  s.runs += 1;

  if (opts.dailyDate && s.lastDailyDate !== opts.dailyDate) {
    s.streak = s.lastDailyDate === yesterdayOf(opts.dailyDate) ? s.streak + 1 : 1;
    s.lastDailyDate = opts.dailyDate;
  }

  save(s);
  return { stats: s, isNewBest };
}
