import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/server/supabase.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ configured: false, total: 0, holders: {} });

  const [{ data: counts }, { data: pc }] = await Promise.all([
    sb.from("badge_counts").select("badge_id, holders"),
    sb.from("player_count").select("total").eq("id", 1).maybeSingle(),
  ]);

  const holders: Record<string, number> = {};
  for (const row of counts ?? []) holders[row.badge_id] = row.holders;

  return NextResponse.json(
    { configured: true, total: pc?.total ?? 0, holders },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } },
  );
}
