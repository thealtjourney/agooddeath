import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/server/supabase.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ configured: false, total: 0, holders: {} });

  const { data } = await sb.rpc("get_badge_counts");
  const board = (data ?? {}) as { total?: number; holders?: Record<string, number> };

  return NextResponse.json(
    { configured: true, total: Number(board.total ?? 0), holders: board.holders ?? {} },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } },
  );
}
