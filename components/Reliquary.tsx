"use client";

import { useEffect } from "react";
import { theme, RARITY_STYLES } from "../lib/game/theme-ui.js";
import { BadgeIcon } from "./BadgeIcon.js";
import type { BadgeTier } from "../lib/engine/types.js";
import type { BadgeState } from "../lib/game/badges-store.js";
import type { BadgeRarity } from "../lib/game/rarity.js";

const TIER_ORDER: BadgeTier[] = ["common", "uncommon", "rare", "epic", "legendary"];

export function Reliquary({
  state,
  rarities,
  onClose,
}: {
  state: BadgeState;
  rarities: Record<string, BadgeRarity>;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const total = theme.badges.length;
  const collected = theme.badges.filter((b) => state.earned[b.id]).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 px-3 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="parchment-surface parchment-grain card-frame relative w-full max-w-lg rounded-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-sm border border-ink/25 px-2.5 py-1 font-body text-xs uppercase tracking-widest text-ink-faded hover:border-ink/50"
        >
          Close
        </button>

        <header className="mb-5 text-center">
          <h2 className="font-black text-3xl text-ink">The Reliquary</h2>
          <p className="mt-1 font-body text-sm text-ink-faded">
            {collected} of {total} relics gathered · {state.runs}{" "}
            {state.runs === 1 ? "life" : "lives"} lived
          </p>
        </header>

        <div className="space-y-5">
          {TIER_ORDER.map((tier) => {
            const group = theme.badges.filter((b) => b.tier === tier);
            if (group.length === 0) return null;
            const style = RARITY_STYLES[tier]!;
            return (
              <section key={tier}>
                <h3
                  className={`mb-2 font-body text-[11px] font-bold uppercase tracking-[0.3em] ${style.text}`}
                >
                  {style.label}
                </h3>
                <div className="grid gap-1.5">
                  {group.map((b) => {
                    const earned = Boolean(state.earned[b.id]);
                    const masked = b.hidden && !earned;
                    const r = rarities[b.id];
                    return (
                      <div
                        key={b.id}
                        className={[
                          "flex items-center gap-3 rounded-sm border px-3 py-2 transition",
                          earned
                            ? "border-ink/30 bg-parchment-light/50"
                            : "border-ink/15 opacity-55",
                        ].join(" ")}
                      >
                        <BadgeIcon
                          icon={masked ? "hourglass" : b.icon}
                          className={[
                            "h-8 w-8 shrink-0",
                            earned ? style.text : "text-ink/40",
                          ].join(" ")}
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
                          <div className={`font-black text-sm ${earned ? style.text : "text-ink-faded"}`}>
                            {r ? (r.pct < 0.1 ? "<0.1%" : `${r.pct}%`) : "—"}
                          </div>
                          <div className="font-body text-[9px] uppercase tracking-wider text-ink-faded">
                            {earned ? "yours" : "have this"}
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
      </div>
    </div>
  );
}
