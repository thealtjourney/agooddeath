"use client";

import { useEffect, useState } from "react";

/** Rising global body count — morbid social proof for the hero. */
export function DeathToll() {
  const [deaths, setDeaths] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d: { configured?: boolean; deaths?: number }) => {
        if (live && d.configured && (d.deaths ?? 0) > 0) setDeaths(d.deaths ?? 0);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  if (deaths === null) return null;

  return (
    <p className="mt-6 font-body text-[15px] text-ink-soft">
      <span className="font-black text-2xl text-rubric tabular-nums">
        {deaths.toLocaleString("en-GB")}
      </span>{" "}
      peasants have met their end so far.
    </p>
  );
}
