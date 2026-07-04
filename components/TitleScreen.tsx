"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { simulate } from "../lib/engine/simulate.js";
import {
  worldHeadlineFor,
  prettyDate,
  dailySeed,
  theme,
  renderParishRecord,
} from "../lib/game/theme-ui.js";
import { loadStats, type PlayStats } from "../lib/game/stats-store.js";
import { loadBadgeState, type BadgeState } from "../lib/game/badges-store.js";
import { ChoiceIcon } from "./ChoiceIcon.js";
import { SpecimenTicker } from "./SpecimenTicker.js";
import { Flourish } from "./Flourish.js";
import { DeathToll } from "./DeathToll.js";
import { NavBar } from "./NavBar.js";

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

  const example = useMemo(() => {
    const life = simulate(
      { choices: { trade: "poacher", village: "forest", lord: "cruel", item: "knife" }, gachaId: "goose" },
      "a-poachers-tale",
      theme,
    );
    return { record: renderParishRecord(life), cause: life.deathCauseId };
  }, []);
  const spec = example.record;

  useEffect(() => {
    setStats(loadStats());
    setBadgeState(loadBadgeState());
  }, []);

  const returning = stats && stats.runs > 0;
  const collected = badgeState
    ? theme.badges.filter((b) => badgeState.earned[b.id]).length
    : 0;

  return (
    <main className="parchment-grain relative min-h-screen">
      <NavBar />

      {/* ---------- Hero ---------- */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-12 pt-12 text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-ink-faded">
          This day, {prettyDate(seed)}
        </p>
        <h1 className="mt-2 font-black text-6xl leading-none text-ink sm:text-8xl">
          A&nbsp;Good&nbsp;Death
        </h1>
        <Flourish className="mt-4" />
        <ChoiceIcon id="peasant" className="mt-4 h-20 w-20 text-ink/80" />
        <p className="mt-5 max-w-md font-body text-[18px] leading-relaxed text-ink-soft">
          Pick your trade, village, lord and one lucky item. Then find out how
          long you last in medieval England. Score: age at death.
        </p>
        <p className="mt-3 font-body text-[15px] italic text-rubric">{headline}</p>

        <div className="mt-7 flex w-full max-w-xs flex-col gap-2.5">
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

        <DeathToll />

        {returning && (
          <div className="mt-7 w-full max-w-xs">
            <div className="grid grid-cols-3 gap-2">
              <Stat label="Best age" value={stats!.bestAge || "—"} />
              <Stat label="Day streak" value={stats!.streak} />
              <Stat label="Lives lived" value={stats!.runs} />
            </div>
            <Link
              href="/badges"
              className="mt-3 inline-block font-body text-[11px] uppercase tracking-widest text-rubric underline-offset-2 hover:underline"
            >
              Your relics · {collected}/{theme.badges.length} →
            </Link>
          </div>
        )}
      </section>

      {/* ---------- Animated specimen ---------- */}
      <section className="mx-auto max-w-md px-6 pb-14">
        <p className="mb-3 text-center font-body text-[11px] uppercase tracking-[0.3em] text-ink-faded">
          A specimen record
        </p>
        <SpecimenTicker
          name={spec.title.replace("The Parish Record of ", "")}
          lines={spec.lines.slice(0, 4)}
          deathLine={spec.deathLine}
          survivedBy={spec.survivedBy}
          score={spec.score}
          cause={example.cause}
          startAge={theme.startAge}
        />
        <p className="mt-4 text-center">
          <Link
            href="/how-it-works"
            className="font-body text-[11px] uppercase tracking-widest text-rubric underline-offset-2 hover:underline"
          >
            How it works →
          </Link>
        </p>
      </section>

      <footer className="mx-auto max-w-2xl px-6 pb-12 text-center font-body text-[11px] text-ink-faded">
        <p>A new parish record every day · no account, no cost</p>
        <p className="mt-1">
          <Link href="/how-it-works" className="hover:text-ink">How it works</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-ink">Terms</Link>
          {" · agooddeath.app"}
        </p>
      </footer>
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
