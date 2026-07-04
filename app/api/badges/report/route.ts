import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/server/supabase.js";
import { simulate } from "../../../../lib/engine/simulate.js";
import { awardBadges } from "../../../../lib/engine/badges.js";
import { theme } from "../../../../lib/game/theme-ui.js";
import { decodeBuild } from "../../../../lib/game/share-url.js";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ configured: false }, { status: 503 });

  const body = (await req.json().catch(() => null)) as
    | { seed?: unknown; b?: unknown; anonId?: unknown }
    | null;
  if (!body) return NextResponse.json({ error: "bad request" }, { status: 400 });

  const { seed, b, anonId } = body;
  if (typeof seed !== "string" || typeof b !== "string" || typeof anonId !== "string") {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const build = decodeBuild(b);
  if (!build) return NextResponse.json({ error: "invalid build" }, { status: 400 });

  // ANTI-CHEAT: badges are computed here from the re-simulated life, never
  // taken from the client — so global rarity counts can't be inflated.
  const life = simulate(build, seed, theme);
  const earned = awardBadges(life, theme.badges);

  const { error } = await sb.rpc("report_badges", {
    p_anon: anonId.slice(0, 64),
    p_badges: earned,
  });
  if (error) return NextResponse.json({ error: "db" }, { status: 500 });

  return NextResponse.json({ configured: true, earned });
}
