"use client";

import { useEffect, useState, useCallback } from "react";
import { getName, setName as saveName } from "../lib/game/identity.js";
import {
  submitDailyRun,
  fetchLeaderboard,
  type LbData,
  type SubmitResult,
} from "../lib/game/leaderboard.js";
import { prettyDate } from "../lib/game/theme-ui.js";

export function Leaderboard({ seed, b }: { seed: string; b: string }) {
  const [data, setData] = useState<LbData | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  const run = useCallback(
    async (submitName: string) => {
      setLoading(true);
      const r = await submitDailyRun(seed, b, submitName);
      setResult(r);
      const d = await fetchLeaderboard(seed);
      setData(d);
      setLoading(false);
    },
    [seed, b],
  );

  useEffect(() => {
    const n = getName();
    setName(n);
    setDraft(n);
    run(n);
  }, [run]);

  const configured =
    (result?.configured ?? true) && (data?.configured ?? true);

  if (loading && !data) {
    return <Panel>Consulting the parish registers…</Panel>;
  }
  if (!configured) {
    return <Panel>The leaderboard is warming up. Check back once it&rsquo;s live.</Panel>;
  }

  const total = data?.total ?? 0;
  const you = data?.you ?? null;
  const outlived =
    you && total > 1 ? Math.round(((total - you.rank) / (total - 1)) * 100) : null;

  const commitName = () => {
    const n = draft.trim().slice(0, 20);
    saveName(n);
    setName(n);
    setEditing(false);
    run(n);
  };

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="font-body text-[11px] uppercase tracking-[0.3em] text-ink-faded">
          Today&rsquo;s parish · {prettyDate(seed)}
        </h3>
        <span className="font-body text-[11px] text-ink-faded">
          {total.toLocaleString("en-GB")} {total === 1 ? "soul" : "souls"}
        </span>
      </div>

      {you && (
        <div className="mb-2 rounded-sm border border-rubric/40 bg-parchment-light/50 px-3 py-2 text-center">
          <span className="font-body text-[15px] text-ink">
            You lie <span className="font-black text-rubric">#{you.rank}</span> of{" "}
            {total.toLocaleString("en-GB")}
            {outlived !== null && (
              <> — outlived {outlived}% of the parish today</>
            )}
          </span>
          {result?.is_new_best && (
            <div className="font-body text-[11px] uppercase tracking-widest text-rubric">
              a new best on today&rsquo;s seed
            </div>
          )}
        </div>
      )}

      <ol className="space-y-1">
        {(data?.top ?? []).slice(0, 10).map((e, i) => (
          <li key={i}>
            <a
              href={`/run/${encodeURIComponent(seed)}?b=${e.build}`}
              className="flex items-center gap-3 rounded-sm border border-ink/15 px-3 py-1.5 hover:border-ink/40"
            >
              <span className="w-6 font-black text-ink-faded tabular-nums">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate font-body text-[15px] text-ink">
                {e.name}
              </span>
              <span className="font-black text-ink tabular-nums">{e.age}</span>
            </a>
          </li>
        ))}
      </ol>

      <div className="mt-2 flex items-center justify-center gap-3">
        <a
          href="/leaderboard"
          className="font-body text-[11px] uppercase tracking-widest text-rubric underline-offset-2 hover:underline"
        >
          Full register →
        </a>
      </div>

      <div className="mt-2 text-center">
        {editing ? (
          <div className="flex items-center justify-center gap-2">
            <input
              value={draft}
              onChange={(ev) => setDraft(ev.target.value)}
              maxLength={20}
              placeholder="Your name"
              className="w-40 rounded-sm border border-ink/30 bg-parchment-light px-2 py-1 font-body text-sm text-ink"
            />
            <button
              onClick={commitName}
              className="rounded-sm border border-rubric bg-rubric px-3 py-1 font-body text-xs font-semibold uppercase tracking-widest text-parchment-light"
            >
              Sign
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setDraft(name);
              setEditing(true);
            }}
            className="font-body text-[11px] uppercase tracking-widest text-rubric underline-offset-2 hover:underline"
          >
            {name ? `Signed as ${name} · rename` : "Sign the register with your name"}
          </button>
        )}
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-sm border border-ink/15 px-3 py-4 text-center font-body text-[13px] italic text-ink-faded">
      {children}
    </div>
  );
}
