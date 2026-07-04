"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LifeRecord } from "../lib/engine/types.js";
import { theme } from "../lib/game/theme-ui.js";

const YEAR_MS = 150;
const EVENT_MS = 1250;

export function YearTicker({
  life,
  onDone,
}: {
  life: LifeRecord;
  onDone: () => void;
}) {
  const eventsByAge = useMemo(() => {
    const m = new Map<number, string>();
    for (const e of life.events) if (e.age < life.ageAtDeath) m.set(e.age, e.text);
    return m;
  }, [life]);

  const ages = useMemo(() => {
    const arr: number[] = [];
    for (let a = theme.startAge; a <= life.ageAtDeath; a++) arr.push(a);
    return arr;
  }, [life]);

  const [i, setI] = useState(0);
  const [log, setLog] = useState<{ age: number; text: string }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setLog([...eventsByAge].map(([age, text]) => ({ age, text })));
      setI(ages.length - 1);
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }

    let idx = 0;
    const step = () => {
      const age = ages[idx]!;
      setI(idx);
      const ev = eventsByAge.get(age);
      if (ev) setLog((l) => [...l, { age, text: ev }]);
      idx++;
      if (idx >= ages.length) {
        timer.current = setTimeout(onDone, 900);
        return;
      }
      timer.current = setTimeout(step, ev ? EVENT_MS : YEAR_MS);
    };
    step();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentAge = ages[i] ?? life.ageAtDeath;
  const recent = log.slice(-4);

  return (
    <div className="relative mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-6 text-center">
      <button
        onClick={() => {
          clearTimeout(timer.current);
          onDone();
        }}
        className="absolute right-4 top-4 rounded-sm border border-ink/25 px-3 py-1 font-body text-xs uppercase tracking-widest text-ink-faded hover:border-ink/50"
      >
        Skip
      </button>

      <p className="font-body text-xs uppercase tracking-[0.3em] text-ink-faded">
        In the year of our Lord
      </p>
      <div className="my-2 font-black text-7xl leading-none text-ink tabular-nums">
        {currentAge}
      </div>
      <p className="font-body text-xs uppercase tracking-[0.3em] text-ink-faded">
        years of age
      </p>

      <div className="mt-8 min-h-[7rem] w-full space-y-1.5">
        {recent.map((e, k) => (
          <p
            key={`${e.age}-${k}`}
            className="animate-flashIn font-body text-[15px] text-ink-soft"
          >
            <span className="font-semibold text-rubric">Age {e.age}:</span>{" "}
            {e.text}
          </p>
        ))}
      </div>
    </div>
  );
}
