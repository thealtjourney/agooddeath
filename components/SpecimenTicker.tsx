"use client";

import { useEffect, useRef, useState } from "react";
import { WoodcutIcon } from "./WoodcutIcon.js";

interface Step {
  age: number;
  text: string;
  death?: boolean;
}

function ageOf(line: string): number {
  const m = line.match(/Age\s+(\d+)/);
  return m ? Number(m[1]) : 0;
}
function bodyOf(line: string): string {
  const i = line.indexOf(":");
  return i >= 0 ? line.slice(i + 1).trim() : line;
}

/**
 * A looping, animated specimen record for the hero: the life plays out year by
 * year, then holds on the death and score, then begins again. Falls back to the
 * full static record under prefers-reduced-motion.
 */
export function SpecimenTicker({
  name,
  lines,
  deathLine,
  survivedBy,
  score,
  cause,
  startAge,
}: {
  name: string;
  lines: string[];
  deathLine: string;
  survivedBy: string;
  score: number;
  cause: string;
  startAge: number;
}) {
  const steps: Step[] = [
    ...lines.map((l) => ({ age: ageOf(l), text: bodyOf(l) })),
    { age: score, text: bodyOf(deathLine), death: true },
  ];

  const [shown, setShown] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(steps.length);
      return;
    }
    let i = 0;
    const tick = () => {
      i += 1;
      setShown(i);
      if (i >= steps.length) {
        timer.current = setTimeout(() => {
          setShown(0);
          i = 0;
          timer.current = setTimeout(tick, 900);
        }, 3600);
        return;
      }
      timer.current = setTimeout(tick, 1150);
    };
    timer.current = setTimeout(tick, 700);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = steps.slice(0, shown);
  const done = shown >= steps.length;
  const currentAge = visible.length ? visible[visible.length - 1]!.age : startAge;

  return (
    <article className="parchment-surface card-frame relative overflow-hidden rounded-sm border-2 border-ink/40 p-5">
      <header className="text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-ink-faded">
          The Parish Record of
        </p>
        <h2 className="mt-1 font-black text-2xl leading-tight text-ink">{name}</h2>
      </header>

      <div className="my-4 flex items-center justify-center">
        <WoodcutIcon
          category={cause}
          className={`h-16 w-16 text-ink transition-opacity duration-500 ${done ? "opacity-100" : "opacity-25"}`}
        />
      </div>

      <div className="mx-auto min-h-[8.5rem] max-w-sm space-y-1 font-body text-[14px] leading-relaxed text-ink-soft">
        {visible.map((s, k) => (
          <p key={`${shown}-${k}`} className={s.death ? "animate-flashIn pt-1 font-semibold text-ink" : "animate-flashIn"}>
            <span className="font-semibold text-rubric">Age {s.age}:</span> {s.text}
          </p>
        ))}
        {done && <p className="animate-flashIn pt-1 text-center italic text-ink">{survivedBy}</p>}
      </div>

      <div className="mt-3 border-t border-ink/25 pt-3 text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-ink-faded">
          {done ? "Age at Death" : "In the year of their age"}
        </p>
        <p className="font-black text-5xl leading-none text-ink tabular-nums">{currentAge}</p>
      </div>
    </article>
  );
}
