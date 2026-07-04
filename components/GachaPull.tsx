"use client";

import { useEffect, useState } from "react";
import type { GachaOption } from "../lib/engine/types.js";
import { RARITY_STYLES } from "../lib/game/theme-ui.js";
import { ChoiceIcon } from "./ChoiceIcon.js";

export function GachaPull({
  gacha,
  onBegin,
}: {
  gacha: GachaOption;
  onBegin: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const style = RARITY_STYLES[gacha.rarity]!;

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 650);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/70 px-6 backdrop-blur-sm">
      <div className="parchment-surface parchment-grain card-frame relative w-full max-w-sm overflow-hidden rounded-sm p-8 text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-ink-faded">
          From the sack of fate
        </p>

        {!revealed ? (
          <div className="my-10 flex flex-col items-center">
            <div className="wax-seal h-16 w-16 animate-pulseSoft rounded-full" />
            <p className="mt-4 font-body text-sm italic text-ink-faded">
              rummaging&hellip;
            </p>
          </div>
        ) : (
          <div className="my-6 animate-stamp">
            <div className="mb-3 flex justify-center">
              <ChoiceIcon
                id={gacha.id}
                className={`h-16 w-16 ${style.text}`}
                strokeWidth={2.4}
              />
            </div>
            <p
              className={`font-body text-[11px] font-bold uppercase tracking-[0.3em] ${style.text}`}
            >
              {style.label}
            </p>
            <h2 className="mt-2 font-black text-3xl leading-tight text-ink">
              {gacha.label}
            </h2>
            <p className="mx-auto mt-3 max-w-[16rem] font-body text-[15px] italic text-ink-soft">
              {gacha.flavour}
            </p>
          </div>
        )}

        <button
          disabled={!revealed}
          onClick={onBegin}
          className={[
            "mt-2 w-full rounded-sm border px-5 py-3 font-body text-sm font-semibold uppercase tracking-widest transition",
            revealed
              ? "border-rubric bg-rubric text-parchment-light hover:brightness-110"
              : "cursor-wait border-ink/20 text-ink-faded/40",
          ].join(" ")}
        >
          Begin your life
        </button>
      </div>
    </div>
  );
}
