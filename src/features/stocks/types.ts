export type SetStatus = "proposed" | "bought" | "sold" | "skipped";
export type SetItemStatus = "pending" | "open" | "stopped_out" | "closed_with_set";
export type ExitReason = "set_close" | "stop_loss";

export type Scan = {
  id: string;
  scanDate: string;
  triggeredBy: "manual" | "cron" | "auto";
  status: "pending" | "complete" | "failed";
  notes: string | null;
  createdAt: string;
};

export type SetItem = {
  id: string;
  setId: string;
  ticker: string;
  xtbSymbol: string;
  exchange: string;
  rank: number;
  suggestedEntryPrice: number;
  suggestedStopLoss: number;
  rationale: string | null;
  gapPct: number | null;
  volumeRatio: number | null;
  atr: number | null;
  actualEntryPrice: number | null;
  quantity: number | null;
  actualExitPrice: number | null;
  exitReason: ExitReason | null;
  hit1pctAt: string | null;
  maxPctObserved: number | null;
  minPctObserved: number | null;
  status: SetItemStatus;
  openedAt: string | null;
  closedAt: string | null;
};

export type StockSet = {
  id: string;
  scanId: string;
  status: SetStatus;
  targetPct: number;
  boughtAt: string | null;
  soldAt: string | null;
  aggregatePnlPct: number | null;
  hitTargetAt: string | null;
  notes: string | null;
  createdAt: string;
  items: SetItem[];
};

export function itemPnlPct(item: SetItem): number | null {
  const entry = item.actualEntryPrice ?? item.suggestedEntryPrice;
  if (!entry) return null;
  const exit = item.actualExitPrice;
  if (exit === null) return null;
  return ((exit - entry) / entry) * 100;
}

// Equal-weight aggregate of a set's realized PnL.
// Items still 'open' or 'pending' are excluded.
export function setAggregatePnlPct(set: StockSet): number {
  const closed = set.items.filter((i) => i.actualExitPrice !== null && i.actualEntryPrice !== null);
  if (closed.length === 0) return 0;
  const sum = closed.reduce((acc, i) => {
    const p = ((i.actualExitPrice! - i.actualEntryPrice!) / i.actualEntryPrice!) * 100;
    return acc + p;
  }, 0);
  return sum / closed.length;
}
