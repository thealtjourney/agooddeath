import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/server/supabase.js";
import { cleanName } from "../../../../lib/server/name-filter.js";
import { simulate } from "../../../../lib/engine/simulate.js";
import { theme } from "../../../../lib/game/theme-ui.js";
import { decodeBuild } from "../../../../lib/game/share-url.js";

export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: Request): Promise<Response> {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ configured: false }, { status: 503 });

  const body = (await req.json().catch(() => null)) as
    | { seed?: unknown; b?: unknown; anonId?: unknown; name?: unknown }
    | null;
  if (!body) return NextResponse.json({ error: "bad request" }, { status: 400 });

  const { seed, b, anonId } = body;
  if (typeof seed !== "string" || typeof b !== "string" || typeof anonId !== "string") {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  // Leaderboards accept only real daily seeds (ISO dates), never freeplay seeds.
  if (!DATE_RE.test(seed)) {
    return NextResponse.json({ error: "not a daily seed" }, { status: 400 });
  }

  const build = decodeBuild(b);
  if (!build) return NextResponse.json({ error: "invalid build" }, { status: 400 });

  // ANTI-CHEAT: the age is computed here by re-running the deterministic engine.
  // Nothing the client claims about its score is trusted.
  const life = simulate(build, seed, theme);

  const { data, error } = await sb.rpc("submit_daily_run", {
    p_seed: seed,
    p_anon: anonId.slice(0, 64),
    p_name: cleanName(body.name),
    p_age: life.ageAtDeath,
    p_build: b,
  });

  if (error) return NextResponse.json({ error: "db" }, { status: 500 });
  return NextResponse.json({ configured: true, age: life.ageAtDeath, ...data });
}
