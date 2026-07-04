"use client";

import { useMemo } from "react";
import { simulate } from "../lib/engine/simulate.js";
import { theme } from "../lib/game/theme-ui.js";
import { decodeBuild } from "../lib/game/share-url.js";
import { DeathCard } from "./DeathCard.js";

export function SharedRun({ seed, b }: { seed: string; b?: string }) {
  const build = useMemo(() => decodeBuild(b), [b]);
  const life = useMemo(
    () => (build ? simulate(build, seed, theme) : null),
    [build, seed],
  );

  if (!life) {
    return (
      <main className="parchment-grain relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="font-black text-4xl text-ink">A Good Death</h1>
        <p className="mt-3 max-w-sm font-body text-ink-soft">
          This parish record could not be found — the link may be damaged.
        </p>
        <a
          href="/"
          className="mt-6 rounded-sm border border-rubric bg-rubric px-5 py-3 font-body text-sm font-semibold uppercase tracking-widest text-parchment-light hover:brightness-110"
        >
          Live your own life →
        </a>
      </main>
    );
  }

  return (
    <main className="parchment-grain relative min-h-screen">
      <div className="mx-auto max-w-xl px-4 pt-6 text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-ink-faded">
          A parish record, shared with you
        </p>
        <a
          href={`/?seed=${encodeURIComponent(seed)}`}
          className="mt-3 inline-block rounded-sm border border-rubric bg-rubric px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-widest text-parchment-light hover:brightness-110"
        >
          Play this same world → beat them
        </a>
      </div>
      <DeathCard life={life} daily mode="shared" />
    </main>
  );
}
