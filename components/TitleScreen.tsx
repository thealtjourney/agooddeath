"use client";

import { useEffect, useState } from "react";
import { worldHeadlineFor, prettyDate, dailySeed, theme } from "../lib/game/theme-ui.js";
import { loadStats, type PlayStats } from "../lib/game/stats-store.js";
import { loadBadgeState, type BadgeState } from "../lib/game/badges-store.js";
import { rarityService, type BadgeRarity } from "../lib/game/rarity.js";
import { ChoiceIcon } from "./ChoiceIcon.js";
import { Reliquary } from "./Reliquary.js";

export function TitleScreen({
  onDaily,
  onFreeplay,
}: {
  onDaily: () => void;
  onFreeplay: () => void;
}) {
  const seed = dailySeed();
  const headline = worldHeadlineFor(seed);

  const [stats, setStats] = useState<PlayStats | null>(null);
  const [badgeState, setBadgeState] = useState<BadgeState | null>(null);
  const [rarities, setRarities] = useState<Record<string, BadgeRarity>>({});
  const [reliquaryOpen, setReliquaryOpen] = useState(false);

  useEffect(() => {
    setStats(loadStats());
    setBadgeState(loadBadgeState());
    let live = true;
    rarityService.getAll().then((r) => live && setRarities(r));
    return () => {
      live = false;
    };
  }, []);

  const returning = stats && stats.runs > 0;
  const collected = badgeState
    ? theme.badges.filter((b) => badgeState.earned[b.id]).length
    : 0;

  return (
    <main className="parchment-grain relative flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <p className="font-body text-xs uppercase tracking-[0.3em] text-ink-faded">
        This day, {prettyDate(seed)}
      </p>
      <h1 className="mt-2 font-black text-6xl leading-none text-ink sm:text-7xl">
        A&nbsp;Good&nbsp;Death
      </h1>

      <ChoiceIcon id="peasant" className="mt-5 h-20 w-20 text-ink/80" />

      <p className="mt-5 max-w-sm font-body text-[17px] leading-relaxed text-ink-soft">
        Pick your trade, village, lord and one lucky item. Then find out how long
        you last in medieval England.
      </p>
      <p className="mt-3 font-body text-[15px] italic text-rubric">{headline}</p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
        <button
          onClick={onDaily}
          className="rounded-sm border border-rubric bg-rubric px-6 py-3.5 font-body text-base font-semibold uppercase tracking-widest text-parchment-light hover:brightness-110"
        >
          Play today&rsquo;s life
        </button>
        <button
          onClick={onFreeplay}
          className="rounded-sm border border-ink/35 px-6 py-3 font-body text-sm font-semibold uppercase tracking-widest text-ink hover:border-ink/60"
        >
          Freeplay
        </button>
      </div>

      {returning && (
        <div className="mt-8 w-full max-w-xs">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Best age" value={stats!.bestAge || "—"} />
            <Stat label="Day streak" value={stats!.streak} />
            <Stat label="Lives lived" value={stats!.runs} />
          </div>
          <button
            onClick={() => setReliquaryOpen(true)}
            className="mt-3 font-body text-[11px] uppercase tracking-widest text-rubric underline-offset-2 hover:underline"
          >
            Open the Reliquary · {collected}/{theme.badges.length} relics
          </button>
        </div>
      )}

      <footer className="mt-10 font-body text-[11px] text-ink-faded">
        A new parish record every day · no account, no cost
      </footer>

      {reliquaryOpen && badgeState && (
        <Reliquary
          state={badgeState}
          rarities={rarities}
          onClose={() => setReliquaryOpen(false)}
        />
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-sm border border-ink/20 py-2">
      <div className="font-black text-2xl text-ink tabular-nums">{value}</div>
      <div className="font-body text-[10px] uppercase tracking-wider text-ink-faded">
        {label}
      </div>
    </div>
  );
}
