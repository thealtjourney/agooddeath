import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/server/supabase.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: Request): Promise<Response> {
  const sb = getSupabase();
  if (!sb) {
    return NextResponse.json({ configured: false, top: [], total: 0, you: null });
  }

  const { searchParams } = new URL(req.url);
  const seed = searchParams.get("seed");
  const anonId = searchParams.get("anonId");
  if (!seed || !DATE_RE.test(seed)) {
    return NextResponse.json({ error: "bad seed" }, { status: 400 });
  }

  const { data, error } = await sb.rpc("get_daily_board", {
    p_seed: seed,
    p_anon: anonId ?? "",
  });

  if (error) {
    return NextResponse.json(
      { configured: true, top: [], total: 0, you: null },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const board = (data ?? {}) as {
    top?: unknown[];
    total?: number;
    you?: { rank: number; age: number } | null;
  };

  return NextResponse.json(
    {
      configured: true,
      top: board.top ?? [],
      total: board.total ?? 0,
      you: board.you ?? null,
    },
    // The board must always reflect the latest writes — no stale caching.
    { headers: { "Cache-Control": "no-store" } },
  );
}
