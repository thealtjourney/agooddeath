"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../lib/game/leaderboard.js";

/** Client island: shows the visitor's own rank on the standalone board. */
export function YourRank({ seed }: { seed: string }) {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetchLeaderboard(seed).then((d) => {
      if (!live) return;
      if (d.you) {
        const pct =
          d.total > 1
            ? Math.round(((d.total - d.you.rank) / (d.total - 1)) * 100)
            : null;
        setLine(
          `You lie #${d.you.rank} of ${d.total.toLocaleString("en-GB")}` +
            (pct !== null ? ` — outlived ${pct}% of the parish` : ""),
        );
      }
    });
    return () => {
      live = false;
    };
  }, [seed]);

  if (!line) return null;
  return (
    <div className="mx-auto mb-4 max-w-md rounded-sm border border-rubric/40 bg-parchment-light/50 px-3 py-2 text-center font-body text-[15px] text-ink">
      {line}
    </div>
  );
}
