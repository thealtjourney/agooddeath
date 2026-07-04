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

  const { data: top } = await sb
    .from("daily_runs")
    .select("name, age, build")
    .eq("seed", seed)
    .order("age", { ascending: false })
    .order("updated_at", { ascending: true })
    .limit(50);

  const { count: total } = await sb
    .from("daily_runs")
    .select("*", { count: "exact", head: true })
    .eq("seed", seed);

  let you: { rank: number; age: number } | null = null;
  if (anonId) {
    const { data: mine } = await sb
      .from("daily_runs")
      .select("age")
      .eq("seed", seed)
      .eq("anon_id", anonId)
      .maybeSingle();
    if (mine) {
      const { count: better } = await sb
        .from("daily_runs")
        .select("*", { count: "exact", head: true })
        .eq("seed", seed)
        .gt("age", mine.age);
      you = { rank: (better ?? 0) + 1, age: mine.age };
    }
  }

  return NextResponse.json(
    { configured: true, top: top ?? [], total: total ?? 0, you },
    // The board must always reflect the latest writes — no stale caching.
    { headers: { "Cache-Control": "no-store" } },
  );
}
