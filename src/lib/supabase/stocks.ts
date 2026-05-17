import { ExitReason, Scan, SetItem, SetItemStatus, SetStatus, StockSet } from "@/features/stocks/types";
import { createClient } from "./server";

type RawScan = {
  id: string;
  scan_date: string;
  triggered_by: string;
  status: string;
  notes: string | null;
  created_at: string | null;
};

type RawItem = {
  id: string;
  set_id: string;
  ticker: string;
  xtb_symbol: string;
  exchange: string;
  rank: number;
  suggested_entry_price: number | string;
  suggested_stop_loss: number | string;
  rationale: string | null;
  gap_pct: number | string | null;
  volume_ratio: number | string | null;
  atr: number | string | null;
  actual_entry_price: number | string | null;
  quantity: number | string | null;
  actual_exit_price: number | string | null;
  exit_reason: string | null;
  hit_1pct_at: string | null;
  max_pct_observed: number | string | null;
  min_pct_observed: number | string | null;
  status: string;
  opened_at: string | null;
  closed_at: string | null;
};

type RawSet = {
  id: string;
  scan_id: string;
  status: string;
  target_pct: number | string;
  bought_at: string | null;
  sold_at: string | null;
  aggregate_pnl_pct: number | string | null;
  hit_target_at: string | null;
  notes: string | null;
  created_at: string | null;
  stock_set_items: RawItem[];
};

const num = (v: number | string | null | undefined): number => (v === null || v === undefined ? 0 : typeof v === "string" ? Number(v) : v);
const numNull = (v: number | string | null | undefined): number | null => (v === null || v === undefined ? null : num(v));

function mapItem(r: RawItem): SetItem {
  return {
    id: r.id,
    setId: r.set_id,
    ticker: r.ticker,
    xtbSymbol: r.xtb_symbol,
    exchange: r.exchange,
    rank: r.rank,
    suggestedEntryPrice: num(r.suggested_entry_price),
    suggestedStopLoss: num(r.suggested_stop_loss),
    rationale: r.rationale,
    gapPct: numNull(r.gap_pct),
    volumeRatio: numNull(r.volume_ratio),
    atr: numNull(r.atr),
    actualEntryPrice: numNull(r.actual_entry_price),
    quantity: numNull(r.quantity),
    actualExitPrice: numNull(r.actual_exit_price),
    exitReason: (r.exit_reason as ExitReason | null) ?? null,
    hit1pctAt: r.hit_1pct_at,
    maxPctObserved: numNull(r.max_pct_observed),
    minPctObserved: numNull(r.min_pct_observed),
    status: r.status as SetItemStatus,
    openedAt: r.opened_at,
    closedAt: r.closed_at,
  };
}

function mapSet(r: RawSet): StockSet {
  return {
    id: r.id,
    scanId: r.scan_id,
    status: r.status as SetStatus,
    targetPct: num(r.target_pct),
    boughtAt: r.bought_at,
    soldAt: r.sold_at,
    aggregatePnlPct: numNull(r.aggregate_pnl_pct),
    hitTargetAt: r.hit_target_at,
    notes: r.notes,
    createdAt: r.created_at ?? "",
    items: (r.stock_set_items ?? []).sort((a, b) => a.rank - b.rank).map(mapItem),
  };
}

function mapScan(r: RawScan): Scan {
  return {
    id: r.id,
    scanDate: r.scan_date,
    triggeredBy: r.triggered_by as Scan["triggeredBy"],
    status: r.status as Scan["status"],
    notes: r.notes,
    createdAt: r.created_at ?? "",
  };
}

export async function fetchStocksData(): Promise<{
  sets: StockSet[];
  scans: Scan[];
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { sets: [], scans: [] };

  const [setsRes, scansRes] = await Promise.all([
    supabase
      .from("stock_sets")
      .select(
        "id, scan_id, status, target_pct, bought_at, sold_at, aggregate_pnl_pct, hit_target_at, notes, created_at, stock_set_items(*)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("stock_scans").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
  ]);

  return {
    sets: ((setsRes.data ?? []) as RawSet[]).map(mapSet),
    scans: ((scansRes.data ?? []) as RawScan[]).map(mapScan),
  };
}
