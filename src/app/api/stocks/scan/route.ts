import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchDailyCandles } from "@/lib/market/yahoo";
import { rankCandidates } from "@/lib/market/scanner";
import { SCANNER_UNIVERSE } from "@/lib/market/universe";

export const maxDuration = 30;

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let data;
  try {
    data = await fetchDailyCandles(SCANNER_UNIVERSE);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }

  if (data.length === 0) {
    return NextResponse.json({ error: "No data returned from XTB" }, { status: 502 });
  }

  const top = rankCandidates(data, 5);
  if (top.length === 0) {
    return NextResponse.json({ error: "No candidates ranked" }, { status: 502 });
  }

  const today = new Date().toISOString().slice(0, 10);

  const scanRes = await supabase
    .from("stock_scans")
    .insert({
      user_id: user.id,
      scan_date: today,
      triggered_by: "manual",
      status: "complete",
      notes: `universe=${SCANNER_UNIVERSE.length}, ranked=${top.length}`,
    })
    .select()
    .single();
  if (scanRes.error || !scanRes.data) {
    return NextResponse.json({ error: scanRes.error?.message ?? "Scan insert failed" }, { status: 500 });
  }

  const setRes = await supabase
    .from("stock_sets")
    .insert({
      user_id: user.id,
      scan_id: scanRes.data.id,
      status: "proposed",
      target_pct: 1.0,
    })
    .select()
    .single();
  if (setRes.error || !setRes.data) {
    return NextResponse.json({ error: setRes.error?.message ?? "Set insert failed" }, { status: 500 });
  }

  const items = top.map((s, i) => ({
    user_id: user.id,
    set_id: setRes.data.id,
    ticker: s.ticker,
    xtb_symbol: s.symbol,
    exchange: s.exchange,
    rank: i + 1,
    suggested_entry_price: s.suggestedEntry,
    suggested_stop_loss: s.suggestedStopLoss,
    rationale: s.rationale,
    gap_pct: s.gapPct,
    volume_ratio: s.volumeRatio,
    atr: s.atr,
    status: "pending" as const,
  }));

  const itemsRes = await supabase.from("stock_set_items").insert(items);
  if (itemsRes.error) {
    return NextResponse.json({ error: itemsRes.error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      scanId: scanRes.data.id,
      setId: setRes.data.id,
      itemCount: top.length,
    },
    { status: 201 },
  );
}
