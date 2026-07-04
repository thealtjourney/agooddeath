"use client";

/**
 * Local record of which badges the player has ever earned, and how many runs
 * they've played. No account required — this is the friction-free layer. The
 * global rarity counter (see rarity.ts) is the only part that needs a backend.
 */
const KEY = "agd:badges:v1";

export interface BadgeState {
  earned: Record<string, { run: number; date: string }>;
  runs: number;
  lastRunId?: string;
}

const EMPTY: BadgeState = { earned: {}, runs: 0 };

export function loadBadgeState(): BadgeState {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as BadgeState;
    return { earned: parsed.earned ?? {}, runs: parsed.runs ?? 0 };
  } catch {
    return { ...EMPTY };
  }
}

function save(state: BadgeState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full / blocked — badges just won't persist */
  }
}

/**
 * Record the badges earned by a finished run. Increments the run counter and
 * returns which of them are newly earned (for the "NEW" flourish).
 */
export function recordRun(
  earnedIds: string[],
  runId: string,
): {
  state: BadgeState;
  newly: string[];
} {
  const state = loadBadgeState();
  // Idempotent: the same finished run recorded twice (e.g. React dev
  // double-mount, or a re-render) must not inflate counts or drop "new" flags.
  if (state.lastRunId === runId) {
    const newly = earnedIds.filter((id) => state.earned[id]?.run === state.runs);
    return { state, newly };
  }
  const runNo = state.runs + 1;
  const newly: string[] = [];
  const date = new Date().toISOString().slice(0, 10);
  for (const id of earnedIds) {
    if (!state.earned[id]) {
      state.earned[id] = { run: runNo, date };
      newly.push(id);
    }
  }
  state.runs = runNo;
  state.lastRunId = runId;
  save(state);
  return { state, newly };
}
