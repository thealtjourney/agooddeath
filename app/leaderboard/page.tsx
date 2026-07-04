import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "../../lib/server/supabase.js";
import { worldHeadlineFor, prettyDate } from "../../lib/game/theme-ui.js";
import { YourRank } from "../../components/YourRank.js";
import { NavBar } from "../../components/NavBar.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
function shift(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function resolveDate(raw: unknown): string {
  const today = todayIso();
  if (typeof raw === "string" && DATE_RE.test(raw) && raw <= today) return raw;
  return today;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { date?: string };
}): Promise<Metadata> {
  const date = resolveDate(searchParams.date);
  const title = `The Parish Register — ${prettyDate(date)}`;
  const description = `Who survived longest in medieval England on ${prettyDate(date)}. A Good Death daily leaderboard.`;
  return { title, description, openGraph: { title, description } };
}

interface Row {
  name: string;
  age: number;
  build: string;
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const date = resolveDate(searchParams.date);
  const today = todayIso();
  const isToday = date === today;
  const prev = shift(date, -1);
  const next = shift(date, 1);

  const sb = getSupabase();
  let rows: Row[] = [];
  let total = 0;
  const configured = Boolean(sb);

  if (sb) {
    const { data } = await sb.rpc("get_daily_board", { p_seed: date, p_anon: "" });
    const board = (data ?? {}) as { top?: Row[]; total?: number };
    rows = board.top ?? [];
    total = board.total ?? 0;
  }

  return (
    <main className="parchment-grain relative min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-xl px-4 py-10">
        <header className="mb-6 text-center">
          <h1 className="font-black text-4xl leading-none text-ink">
            The Parish Register
          </h1>
          <p className="mt-2 font-body text-sm text-ink-faded">
            {prettyDate(date)} · {total.toLocaleString("en-GB")}{" "}
            {total === 1 ? "soul" : "souls"}
          </p>
          <p className="mt-1 font-body text-[15px] italic text-rubric">
            {worldHeadlineFor(date)}
          </p>
        </header>

        {/* Day navigation */}
        <div className="mb-5 flex items-center justify-between font-body text-sm">
          <Link
            href={`/leaderboard?date=${prev}`}
            className="rounded-sm border border-ink/30 px-3 py-1.5 uppercase tracking-widest text-ink hover:border-ink/60"
          >
            ← {prettyDate(prev)}
          </Link>
          {!isToday ? (
            <Link
              href={`/leaderboard?date=${next}`}
              className="rounded-sm border border-ink/30 px-3 py-1.5 uppercase tracking-widest text-ink hover:border-ink/60"
            >
              {prettyDate(next)} →
            </Link>
          ) : (
            <span className="px-3 py-1.5 uppercase tracking-widest text-ink-faded/50">
              today
            </span>
          )}
        </div>

        {isToday && <YourRank seed={date} />}

        {!configured ? (
          <Panel>The register is warming up. Check back once it&rsquo;s live.</Panel>
        ) : rows.length === 0 ? (
          <Panel>
            No one faced this day&rsquo;s seed.{" "}
            {isToday && "Be the first name in the register."}
          </Panel>
        ) : (
          <ol className="space-y-1">
            {rows.map((e, i) => (
              <li key={i}>
                <Link
                  href={`/run/${encodeURIComponent(date)}?b=${e.build}`}
                  className="flex items-center gap-3 rounded-sm border border-ink/15 px-3 py-2 hover:border-ink/40"
                >
                  <span className="w-8 text-center font-black text-ink-faded tabular-nums">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-body text-[16px] text-ink">
                    {e.name}
                  </span>
                  <span className="font-black text-lg text-ink tabular-nums">{e.age}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="rounded-sm border border-rubric bg-rubric px-6 py-3 font-body text-sm font-semibold uppercase tracking-widest text-parchment-light hover:brightness-110"
          >
            Play today&rsquo;s life →
          </Link>
        </div>
      </div>
    </main>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-ink/15 px-4 py-8 text-center font-body text-[15px] italic text-ink-faded">
      {children}
    </div>
  );
}
