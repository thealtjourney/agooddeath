"use client";

import { useEffect, useState } from "react";
import { theme, RARITY_STYLES } from "../../lib/game/theme-ui.js";
import type { BadgeTier } from "../../lib/engine/types.js";
import { loadBadgeState, type BadgeState } from "../../lib/game/badges-store.js";
import { rarityService, type BadgeRarity } from "../../lib/game/rarity.js";
import { BadgeIcon } from "../../components/BadgeIcon.js";
import { NavBar } from "../../components/NavBar.js";
import { Flourish } from "../../components/Flourish.js";

const TIER_ORDER: BadgeTier[] = ["common", "uncommon", "rare", "epic", "legendary"];

export default function BadgesPage() {
  const [state, setState] = useState<BadgeState | null>(null);
  const [rarities, setRarities] = useState<Record<string, BadgeRarity>>({});

  useEffect(() => {
    setState(loadBadgeState());
    let live = true;
    rarityService.getAll().then((r) => live && setRarities(r));
    return () => {
      live = false;
    };
  }, []);

  const earned = state?.earned ?? {};
  const total = theme.badges.length;
  const collected = theme.badges.filter((b) => earned[b.id]).length;

  return (
    <main className="parchment-grain relative min-h-screen">
      <NavBar />

      <section className="mx-auto max-w-lg px-6 pb-16 pt-10">
        <h1 className="text-center font-black text-4xl text-ink">The Reliquary</h1>
        <p className="mt-2 text-center font-body text-sm text-ink-faded">
          {collected} of {total} relics gathered
          {state ? ` · ${state.runs} ${state.runs === 1 ? "life" : "lives"} lived` : ""}
        </p>
        <Flourish className="mb-7 mt-4" />

        <div className="space-y-5">
          {TIER_ORDER.map((tier) => {
            const group = theme.badges.filter((b) => b.tier === tier);
            if (group.length === 0) return null;
            const style = RARITY_STYLES[tier]!;
            return (
              <section key={tier}>
                <h2 className={`mb-2 font-body text-[11px] font-bold uppercase tracking-[0.3em] ${style.text}`}>
                  {style.label}
                </h2>
                <div className="grid gap-1.5">
                  {group.map((b) => {
                    const has = Boolean(earned[b.id]);
                    const masked = b.hidden && !has;
                    const r = rarities[b.id];
                    return (
                      <div
                        key={b.id}
                        className={[
                          "flex items-center gap-3 rounded-sm border px-3 py-2 transition",
                          has ? "border-ink/30 bg-parchment-light/50" : "border-ink/15 opacity-55",
                        ].join(" ")}
                      >
                        <BadgeIcon
                          icon={masked ? "hourglass" : b.icon}
                          className={`h-8 w-8 shrink-0 ${has ? style.text : "text-ink/40"}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-body text-[15px] font-semibold text-ink">
                            {masked ? "A secret relic" : b.name}
                          </div>
                          <div className="font-body text-xs text-ink-faded">
                            {masked ? "Earn it to reveal what it honours." : b.description}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className={`font-black text-sm ${has ? style.text : "text-ink-faded"}`}>
                            {r ? (r.pct < 0.1 ? "<0.1%" : `${r.pct}%`) : "—"}
                          </div>
                          <div className="font-body text-[9px] uppercase tracking-wider text-ink-faded">
                            {has ? "yours" : "have this"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="rounded-sm border border-rubric bg-rubric px-6 py-3 font-body text-sm font-semibold uppercase tracking-widest text-parchment-light hover:brightness-110"
          >
            Earn some relics →
          </a>
        </div>
      </section>
    </main>
  );
}
