"use client";

import { theme, RARITY_STYLES } from "../lib/game/theme-ui.js";
import { BadgeIcon } from "./BadgeIcon.js";
import { rarityLabel, type BadgeRarity } from "../lib/game/rarity.js";

export function BadgeStrip({
  earnedIds,
  newly,
  rarities,
  collected,
  total,
  readOnly = false,
  onOpen,
}: {
  earnedIds: string[];
  newly: string[];
  rarities: Record<string, BadgeRarity>;
  collected: number;
  total: number;
  readOnly?: boolean;
  onOpen: () => void;
}) {
  if (earnedIds.length === 0) return null;

  const byId = new Map(theme.badges.map((b) => [b.id, b]));
  const earned = earnedIds
    .map((id) => byId.get(id)!)
    .filter(Boolean)
    .sort((a, b) => (rarities[a.id]?.pct ?? 100) - (rarities[b.id]?.pct ?? 100));

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="font-body text-[11px] uppercase tracking-[0.3em] text-ink-faded">
          Relics of this life
        </h3>
        {!readOnly && (
          <button
            onClick={onOpen}
            className="font-body text-[11px] uppercase tracking-widest text-rubric underline-offset-2 hover:underline"
          >
            Reliquary {collected}/{total}
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {earned.map((b) => {
          const style = RARITY_STYLES[b.tier]!;
          const isNew = newly.includes(b.id);
          return (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-sm border border-ink/20 bg-parchment-light/40 px-3 py-2"
            >
              <BadgeIcon icon={b.icon} className={`h-8 w-8 shrink-0 ${style.text}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[15px] font-semibold text-ink">
                    {b.name}
                  </span>
                  {isNew && (
                    <span className="rounded-sm bg-rubric px-1.5 py-0.5 font-body text-[9px] font-bold uppercase tracking-wider text-parchment-light">
                      New
                    </span>
                  )}
                </div>
                <div className="font-body text-xs text-ink-faded">{b.description}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className={`font-black text-sm ${style.text}`}>
                  {rarities[b.id] ? `${fmtPct(rarities[b.id]!.pct)}` : "—"}
                </div>
                <div className="font-body text-[9px] uppercase tracking-wider text-ink-faded">
                  have this
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-1.5 text-center font-body text-[10px] text-ink-faded">
        Rarity across all peasants who have ever played.
      </p>
    </div>
  );
}

function fmtPct(pct: number): string {
  return pct < 0.1 ? "<0.1%" : `${pct}%`;
}

export { rarityLabel };
