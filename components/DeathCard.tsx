"use client";

import { useEffect, useMemo, useState } from "react";
import type { LifeRecord } from "../lib/engine/types.js";
import { renderParishRecord, theme, prettyDate } from "../lib/game/theme-ui.js";
import { awardBadges } from "../lib/engine/badges.js";
import { recordRun, type BadgeState } from "../lib/game/badges-store.js";
import { rarityService, type BadgeRarity } from "../lib/game/rarity.js";
import { encodeBuild } from "../lib/game/share-url.js";
import { ShareBar } from "./ShareBar.js";
import { WoodcutIcon } from "./WoodcutIcon.js";
import { CountUp } from "./CountUp.js";
import { BadgeStrip } from "./BadgeStrip.js";
import { Reliquary } from "./Reliquary.js";
import { Leaderboard } from "./Leaderboard.js";

type Variant = "standard" | "plague" | "good";

function variantOf(life: LifeRecord): Variant {
  if (life.goodDeath) return "good";
  if (life.stats.plaguesEndured > 0 || life.deathCauseId.includes("pestilence"))
    return "plague";
  return "standard";
}

const FRAME: Record<Variant, string> = {
  standard: "border-ink/40",
  plague: "border-ink ring-2 ring-ink/80",
  good: "border-gilt ring-2 ring-gilt/70",
};

export function DeathCard({
  life,
  daily,
  mode = "play",
  result,
  onAgain,
  onFreeplay,
  onHome,
}: {
  life: LifeRecord;
  daily: boolean;
  mode?: "play" | "shared";
  result?: { isNewBest: boolean; streak: number; bestAge: number };
  onAgain?: () => void;
  onFreeplay?: () => void;
  onHome?: () => void;
}) {
  const shared = mode === "shared";
  const record = renderParishRecord(life);
  const variant = variantOf(life);

  const earnedIds = useMemo(() => awardBadges(life, theme.badges), [life]);
  const runId = `${life.seed}:${life.build.gachaId}:${life.ageAtDeath}:${life.deathCauseId}`;
  const [badgeState, setBadgeState] = useState<BadgeState | null>(null);
  const [newly, setNewly] = useState<string[]>([]);
  const [rarities, setRarities] = useState<Record<string, BadgeRarity>>({});
  const [reliquaryOpen, setReliquaryOpen] = useState(false);

  useEffect(() => {
    let live = true;
    rarityService.getAll().then((r) => live && setRarities(r));
    // A run viewed via a shared link is not the viewer's own life — don't
    // record it to their Reliquary or report it to the global counter.
    if (!shared) {
      const { state, newly } = recordRun(earnedIds, runId);
      setBadgeState(state);
      setNewly(newly);
      rarityService.report(life.seed, encodeBuild(life.build));
    }
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, shared]);

  const collected = badgeState
    ? theme.badges.filter((b) => badgeState.earned[b.id]).length
    : 0;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      {!shared && onHome && (
        <button
          onClick={onHome}
          className="mb-3 font-body text-xs uppercase tracking-widest text-ink-faded hover:text-ink"
        >
          ← Gate
        </button>
      )}
      <article
        className={`parchment-surface parchment-grain card-frame animate-riseIn relative overflow-hidden rounded-sm border-2 ${FRAME[variant]} p-6 sm:p-8`}
      >
        {variant === "good" && (
          <p className="mb-3 text-center font-black text-lg tracking-wide text-gilt">
            ✦ A Good Death ✦
          </p>
        )}

        <header className="text-center">
          <p className="font-body text-[11px] uppercase tracking-[0.3em] text-ink-faded">
            The Parish Record of
          </p>
          <h1 className="mt-1 font-black text-3xl leading-tight text-ink sm:text-4xl">
            {record.title.replace("The Parish Record of ", "")}
          </h1>
        </header>

        <div className="my-5 flex justify-center">
          <WoodcutIcon
            category={life.deathCauseId}
            good={variant === "good"}
            className="h-24 w-24 animate-pop text-ink"
          />
        </div>

        <div className="mx-auto max-w-md space-y-1.5 font-body text-[15px] leading-relaxed text-ink-soft">
          {record.lines.map((l, k) => (
            <p key={k}>
              <span className="font-semibold text-rubric">{l.slice(0, l.indexOf(":") + 1)}</span>
              {l.slice(l.indexOf(":") + 1)}
            </p>
          ))}
          <p className="pt-1 font-semibold text-ink">
            <span className="text-rubric">
              {record.deathLine.slice(0, record.deathLine.indexOf(":") + 1)}
            </span>
            {record.deathLine.slice(record.deathLine.indexOf(":") + 1)}
          </p>
          {record.savedNote && (
            <p className="pt-1 text-[13px] italic text-ink-faded">{record.savedNote}</p>
          )}
          <p className="pt-2 text-center font-body text-[15px] italic text-ink">
            {record.survivedBy}
          </p>
        </div>

        <div className="my-6 border-y border-ink/25 py-4 text-center">
          <p className="font-body text-[11px] uppercase tracking-[0.3em] text-ink-faded">
            {theme.scoreLabel}
          </p>
          <p
            className={`font-black leading-none ${variant === "good" ? "text-gilt" : "text-ink"} text-6xl`}
          >
            <CountUp value={record.score} duration={900} />
          </p>
          {!shared && result && (
            <p className="mt-2 font-body text-[13px] text-ink-soft">
              {result.isNewBest ? (
                <span className="font-semibold text-rubric">A new personal best!</span>
              ) : (
                <>Your best: {result.bestAge}</>
              )}
              {daily && result.streak > 1 && (
                <> · {result.streak}-day streak</>
              )}
            </p>
          )}
        </div>

        <StatStrip life={life} />

        <BadgeStrip
          earnedIds={earnedIds}
          newly={newly}
          rarities={rarities}
          collected={collected}
          total={theme.badges.length}
          readOnly={shared}
          onOpen={() => setReliquaryOpen(true)}
        />

        {daily && !shared && (
          <Leaderboard seed={life.seed} b={encodeBuild(life.build)} />
        )}

        <footer className="mt-5 flex items-center justify-between font-body text-[11px] text-ink-faded">
          <span>agooddeath.app</span>
          <span>{daily ? prettyDate(life.seed) : "freeplay"}</span>
        </footer>
      </article>

      {reliquaryOpen && badgeState && !shared && (
        <Reliquary
          state={badgeState}
          rarities={rarities}
          onClose={() => setReliquaryOpen(false)}
        />
      )}

      <ShareBar
        life={life}
        record={record}
        daily={daily}
        shared={shared}
        onAgain={onAgain}
        onFreeplay={onFreeplay}
      />
    </div>
  );
}

function StatStrip({ life }: { life: LifeRecord }) {
  const items: [string, number | string][] = [
    ["Age at Death", life.ageAtDeath],
    ["Children", life.stats.childrenSurvived],
    ["Plagues", life.stats.plaguesEndured],
    ["Accused", life.stats.timesAccused],
  ];
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {items.map(([label, val]) => (
        <div key={label} className="rounded-sm border border-ink/20 py-2">
          <div className="font-black text-xl text-ink tabular-nums">{val}</div>
          <div className="font-body text-[10px] uppercase tracking-wider text-ink-faded">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
