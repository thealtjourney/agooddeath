import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/server/supabase.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Global vanity stats for the homepage: total deaths + total players. */
export async function GET(): Promise<Response> {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ configured: false, deaths: 0, players: 0 });

  const { data } = await sb.rpc("get_global_stats");
  const stats = (data ?? {}) as { deaths?: number; players?: number };

  return NextResponse.json(
    {
      configured: true,
      deaths: Number(stats.deaths ?? 0),
      players: Number(stats.players ?? 0),
    },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } },
  );
}
