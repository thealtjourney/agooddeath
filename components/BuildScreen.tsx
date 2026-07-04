"use client";

import { SLOTS, worldHeadlineFor, prettyDate } from "../lib/game/theme-ui.js";
import type { GameState } from "../lib/game/useGame.js";
import { ChoiceIcon } from "./ChoiceIcon.js";

export function BuildScreen({
  state,
  select,
  allChosen,
  onPull,
  onHome,
}: {
  state: GameState;
  select: (slot: string, id: string) => void;
  allChosen: boolean;
  onPull: () => void;
  onHome: () => void;
}) {
  const headline = worldHeadlineFor(state.seed);

  return (
    <div className="relative mx-auto w-full max-w-xl px-4 pb-28 pt-8">
      <button
        onClick={onHome}
        className="absolute left-4 top-4 font-body text-xs uppercase tracking-widest text-ink-faded hover:text-ink"
      >
        ← Gate
      </button>
      <header className="mb-6 text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-ink-faded">
          {state.daily ? `This day, ${prettyDate(state.seed)}` : "A freeplay life"}
        </p>
        <h1 className="mt-1 font-black text-4xl leading-none text-ink">
          A&nbsp;Good&nbsp;Death
        </h1>
        <div className="mt-3 flex justify-center">
          <ChoiceIcon id="peasant" className="h-14 w-14 text-ink/80" />
        </div>
        <p className="mt-2 font-body text-[15px] italic text-rubric">{headline}</p>
      </header>

      <div className="space-y-5">
        {SLOTS.map((slot) => (
          <section key={slot.id}>
            <h2 className="mb-2 flex items-baseline gap-2 font-body text-sm font-semibold uppercase tracking-widest text-ink-soft">
              <span className="font-black text-rubric text-lg leading-none">
                {slot.label[0]}
              </span>
              {slot.label}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {slot.options.map((opt) => {
                const selected = state.selections[slot.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => select(slot.id, opt.id)}
                    className={[
                      "parchment-surface group relative overflow-hidden rounded-sm border px-3 py-2 text-left transition",
                      selected
                        ? "border-rubric ring-1 ring-rubric shadow-md"
                        : "border-ink/25 hover:border-ink/50",
                    ].join(" ")}
                    aria-pressed={selected}
                  >
                    <div className="flex items-start gap-2.5">
                      <ChoiceIcon
                        id={opt.id}
                        className={[
                          "mt-0.5 h-9 w-9 shrink-0",
                          selected ? "text-rubric" : "text-ink/75",
                        ].join(" ")}
                      />
                      <div className="min-w-0">
                        <div className="font-body text-[15px] font-semibold leading-tight text-ink">
                          {opt.label}
                        </div>
                        <div className="mt-0.5 font-body text-xs leading-snug text-ink-faded">
                          {opt.flavour}
                        </div>
                      </div>
                    </div>
                    {selected && (
                      <span className="wax-seal pointer-events-none absolute -right-2 -top-2 h-7 w-7 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/20 bg-parchment-dark/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <p className="flex-1 font-body text-xs text-ink-faded">
            {allChosen
              ? "Your lot is cast. Now tempt fortune."
              : "Choose a trade, a village, a lord and an item."}
          </p>
          <button
            disabled={!allChosen}
            onClick={onPull}
            className={[
              "rounded-sm border px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-widest transition",
              allChosen
                ? "border-rubric bg-rubric text-parchment-light hover:brightness-110"
                : "cursor-not-allowed border-ink/20 text-ink-faded/50",
            ].join(" ")}
          >
            Draw fortune
          </button>
        </div>
      </div>
    </div>
  );
}
