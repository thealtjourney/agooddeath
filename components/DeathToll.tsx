"use client";

import { useEffect, useState } from "react";
import { CountUp } from "./CountUp.js";

/** Rising global body count — morbid social proof for the hero. */
export function DeathToll() {
  const [deaths, setDeaths] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    const load = () =>
      fetch("/api/stats")
        .then((r) => r.json())
        .then((d: { configured?: boolean; deaths?: number }) => {
          if (live && d.configured && (d.deaths ?? 0) > 0) setDeaths(d.deaths ?? 0);
        })
        .catch(() => {});
    load();
    // Poll so the toll visibly climbs while the page is open.
    const id = setInterval(load, 20000);
    return () => {
      live = false;
      clearInterval(id);
    };
  }, []);

  if (deaths === null) return null;

  return (
    <p className="mt-6 font-body text-[15px] text-ink-soft">
      <CountUp value={deaths} className="font-black text-2xl text-rubric tabular-nums" />{" "}
      peasants have met their end so far.
    </p>
  );
}
