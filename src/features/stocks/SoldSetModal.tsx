"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { createClient } from "@/lib/supabase/client";
import { useAsyncRefresh } from "@/lib/useAsyncRefresh";
import { StockSet, setAggregatePnlPct } from "./types";
import { formatPct, formatPrice } from "./stockUtils";

export function SoldSetModal({ set, onClose }: { set: StockSet; onClose: () => void }) {
  const openItems = set.items.filter((i) => i.status === "open");

  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(openItems.map((i) => [i.id, i.actualEntryPrice ? String(i.actualEntryPrice) : ""])),
  );
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPending, refresh } = useAsyncRefresh(onClose);

  const busy = fetching || isPending;
  const allValid = openItems.every((i) => Number(prices[i.id]) > 0);
  const disabled = !allValid || busy;

  // Preview aggregate assuming the entered prices are exits
  const previewSet: StockSet = {
    ...set,
    items: set.items.map((i) =>
      i.status === "open" && Number(prices[i.id]) > 0
        ? { ...i, actualExitPrice: Number(prices[i.id]) }
        : i,
    ),
  };
  const previewAggregate = setAggregatePnlPct(previewSet);

  const handleConfirm = async () => {
    if (disabled) return;
    setFetching(true);
    setError(null);
    const supabase = createClient();
    const now = new Date().toISOString();

    for (const item of openItems) {
      const price = Number(prices[item.id]);
      const { error: err } = await supabase
        .from("stock_set_items")
        .update({
          actual_exit_price: price,
          exit_reason: "set_close",
          status: "closed_with_set",
          closed_at: now,
        })
        .eq("id", item.id);
      if (err) {
        setError(err.message);
        setFetching(false);
        return;
      }
    }

    const finalSet: StockSet = {
      ...set,
      items: set.items.map((i) =>
        i.status === "open"
          ? { ...i, actualExitPrice: Number(prices[i.id]), status: "closed_with_set" }
          : i,
      ),
    };
    const aggregate = setAggregatePnlPct(finalSet);

    const { error: setErr } = await supabase
      .from("stock_sets")
      .update({ status: "sold", sold_at: now, aggregate_pnl_pct: aggregate })
      .eq("id", set.id);
    if (setErr) {
      setError(setErr.message);
      setFetching(false);
      return;
    }

    setFetching(false);
    refresh();
  };

  return (
    <Modal onClose={onClose}>
      <span className="text-zinc-500 uppercase tracking-wider text-extrasmall">
        Sprzedaj zestaw · {openItems.length} otwartych
      </span>

      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {openItems.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-zinc-700">{item.ticker}</span>
              <span className="text-zinc-400 text-extrasmall">
                {item.exchange} · entry {formatPrice(item.actualEntryPrice ?? item.suggestedEntryPrice)}
              </span>
            </div>
            <input
              type="number"
              step="0.0001"
              className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none tabular-nums w-24"
              placeholder="cena sprzedaży"
              value={prices[item.id] ?? ""}
              onChange={(e) => setPrices((prev) => ({ ...prev, [item.id]: e.target.value }))}
              autoComplete="off"
            />
          </div>
        ))}
      </div>

      {allValid && (
        <span className="text-zinc-500 text-extrasmall tabular-nums">aggregate: {formatPct(previewAggregate)}</span>
      )}
      {error && <span className="text-red-500 text-extrasmall">{error}</span>}

      <div className="flex gap-2 justify-end">
        <button className="text-zinc-400 hover:text-zinc-600 cursor-pointer" disabled={busy} onClick={onClose}>
          anuluj
        </button>
        <button
          className="text-zinc-700 hover:text-zinc-900 cursor-pointer disabled:opacity-40"
          disabled={disabled}
          onClick={handleConfirm}
        >
          sprzedaj
        </button>
      </div>
    </Modal>
  );
}
