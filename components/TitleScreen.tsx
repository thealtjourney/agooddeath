"use client";

import { useEffect, useMemo, useState } from "react";
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
import { rarityService, type BadgeRarity } from "../lib/game/rarity.js";
import { fetchLeaderboard, type LbData } from "../lib/game/leaderboard.js";
import { ChoiceIcon } from "./ChoiceIcon.js";
import { WoodcutIcon } from "./WoodcutIcon.js";
import { Reliquary } from "./Reliquary.js";
import { SpecimenTicker } from "./SpecimenTicker.js";
import { Flourish } from "./Flourish.js";

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
  const [board, setBoard] = useState<LbData | null>(null);
  const [reliquaryOpen, setReliquaryOpen] = useState(false);

  // A fixed, deterministic example run for the hero card.
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
    let live = true;
    rarityService.getAll().then((r) => live && setRarities(r));
    fetchLeaderboard(seed).then((b) => live && setBoard(b));
    return () => {
      live = false;
    };
  }, [seed]);

  const returning = stats && stats.runs > 0;
  const collected = badgeState
    ? theme.badges.filter((b) => badgeState.earned[b.id]).length
    : 0;
  const players = board?.total ?? 0;

  return (
    <main className="parchment-grain relative min-h-screen">
      {/* ---------- Hero ---------- */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-12 pt-14 text-center">
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

        {returning && (
          <div className="mt-7 w-full max-w-xs">
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
      </section>

      {/* ---------- Example card (animated) ---------- */}
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
      </section>

      {/* ---------- Social proof ---------- */}
      <section className="mx-auto max-w-md px-6 pb-14 text-center">
        <h2 className="font-black text-2xl text-ink">Today&rsquo;s parish</h2>
        {players > 0 ? (
          <>
            <p className="mt-1 font-body text-sm text-ink-faded">
              {players.toLocaleString("en-GB")} {players === 1 ? "soul has" : "souls have"} tried
              their luck on today&rsquo;s seed
            </p>
            <ol className="mt-4 space-y-1 text-left">
              {(board?.top ?? []).slice(0, 5).map((e, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-sm border border-ink/15 px-3 py-1.5"
                >
                  <span className="w-5 font-black text-ink-faded tabular-nums">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate font-body text-[15px] text-ink">
                    {e.name}
                  </span>
                  <span className="font-black text-ink tabular-nums">{e.age}</span>
                </li>
              ))}
            </ol>
            <a
              href="/leaderboard"
              className="mt-3 inline-block font-body text-[11px] uppercase tracking-widest text-rubric underline-offset-2 hover:underline"
            >
              See the full register →
            </a>
          </>
        ) : (
          <p className="mt-2 font-body text-[15px] italic text-ink-soft">
            No one has faced today&rsquo;s seed yet. Be the first name in the register.
          </p>
        )}
      </section>

      <Flourish className="pb-12" />

      {/* ---------- How it works ---------- */}
      <section className="mx-auto max-w-3xl px-6 pb-14">
        <h2 className="mb-6 text-center font-black text-2xl text-ink">How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Step icon={<ChoiceIcon id="peasant" className="h-12 w-12 text-ink/80" />} n="I" title="Build a peasant">
            Four choices and one lucky draw of fate. Every pick shifts your odds
            in the medieval meat-grinder.
          </Step>
          <Step icon={<WoodcutIcon category="the_pestilence" className="h-12 w-12 text-ink/80" />} n="II" title="Watch them die">
            Live year by year through plague, famine, war and the occasional
            falling hay cart. Most peasants don&rsquo;t see forty.
          </Step>
          <Step icon={<WoodcutIcon category="old_age" className="h-12 w-12 text-ink/80" />} n="III" title="Share the record">
            Get an illuminated parish record of your life and death. Compare your
            age with the world, and dare your friends to last longer.
          </Step>
        </div>
      </section>

      <Flourish className="pb-12" />

      {/* ---------- SEO / about ---------- */}
      <section className="mx-auto max-w-2xl px-6 pb-16">
        <div className="space-y-5 font-body text-[15px] leading-relaxed text-ink-soft">
          <h2 className="font-black text-2xl text-ink">
            How long would you survive medieval England?
          </h2>
          <p>
            <span className="rubric-cap">A</span> Good Death is a free browser game
            about surviving the Middle Ages as an ordinary English peasant. You
            build a life from a trade, a village, a lord and a single lucky
            possession, then watch it play out through a world of dysentery, bad
            harvests, feudal justice and the Black Death. Your score is simply how
            old you manage to get — and dying peacefully in bed of old age is the
            rarest achievement of all.
          </p>
          <p>
            Every day brings a new shared seed: the same world for everyone, so a
            plague year is a plague year for the whole parish. The same choices in
            a different year, or different choices in the same year, tell a very
            different tale. There are no accounts to make and nothing to buy — just
            a quick, funny, faintly grim reminder of how brutal, and how strangely
            survivable, medieval life could be.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Faq q="Is A Good Death free?">
            Yes — completely free, no account, no cost. It runs in any modern
            browser on phone or desktop.
          </Faq>
          <Faq q="How do you play?">
            Pick a trade, a village, a lord and an item, then draw one random piece
            of fortune. Your peasant lives out their years and eventually dies; you
            get a shareable parish record and a score, which is their age at death.
          </Faq>
          <Faq q="What is a 'good death'?">
            Reaching seventy or more and dying quietly in bed. In a world of plague
            and hay carts it&rsquo;s a genuine rarity — only a lucky few manage it.
          </Faq>
          <Faq q="Is it historically accurate?">
            It&rsquo;s played for deadpan laughs rather than as a textbook, but the
            trades, illnesses, taxes and calamities are all rooted in real medieval
            English life. Everything is fictional — no real people are named.
          </Faq>
        </div>
      </section>

      <footer className="mx-auto max-w-2xl px-6 pb-12 text-center font-body text-[11px] text-ink-faded">
        A new parish record every day · no account, no cost · agooddeath.app
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

function Step({
  icon,
  n,
  title,
  children,
}: {
  icon: React.ReactNode;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {icon}
      <h3 className="mt-3 font-black text-lg text-ink">
        <span className="text-rubric">{n}.</span> {title}
      </h3>
      <p className="mt-1 font-body text-[14px] leading-snug text-ink-faded">{children}</p>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-ink/15 px-4 py-3">
      <h3 className="font-body text-[15px] font-semibold text-ink">{q}</h3>
      <p className="mt-1 font-body text-[14px] leading-relaxed text-ink-faded">{children}</p>
    </div>
  );
}
