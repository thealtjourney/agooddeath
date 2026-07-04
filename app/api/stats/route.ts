import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/server/supabase.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Global vanity stats for the homepage: total deaths + total players. */
export async function GET(): Promise<Response> {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ configured: false, deaths: 0, players: 0 });

  const [{ data: gs }, { data: pc }] = await Promise.all([
    sb.from("global_stats").select("total_deaths").eq("id", 1).maybeSingle(),
    sb.from("player_count").select("total").eq("id", 1).maybeSingle(),
  ]);

  return NextResponse.json(
    {
      configured: true,
      deaths: Number(gs?.total_deaths ?? 0),
      players: pc?.total ?? 0,
    },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } },
  );
}
