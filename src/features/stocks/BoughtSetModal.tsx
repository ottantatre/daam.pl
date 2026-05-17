"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { createClient } from "@/lib/supabase/client";
import { useAsyncRefresh } from "@/lib/useAsyncRefresh";
import { StockSet } from "./types";
import { formatPrice } from "./stockUtils";

export function BoughtSetModal({ set, onClose }: { set: StockSet; onClose: () => void }) {
  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(set.items.map((i) => [i.id, String(i.suggestedEntryPrice)])),
  );
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPending, refresh } = useAsyncRefresh(onClose);

  const busy = fetching || isPending;
  const allValid = set.items.every((i) => {
    const p = Number(prices[i.id]);
    return p > 0;
  });
  const disabled = !allValid || busy;

  const handleConfirm = async () => {
    if (disabled) return;
    setFetching(true);
    setError(null);
    const supabase = createClient();
    const now = new Date().toISOString();

    for (const item of set.items) {
      const price = Number(prices[item.id]);
      const { error: err } = await supabase
        .from("stock_set_items")
        .update({ actual_entry_price: price, status: "open", opened_at: now })
        .eq("id", item.id);
      if (err) {
        setError(err.message);
        setFetching(false);
        return;
      }
    }

    const { error: setErr } = await supabase
      .from("stock_sets")
      .update({ status: "bought", bought_at: now })
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
        Kup zestaw · {set.items.length} tickerów
      </span>

      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {set.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-zinc-700">{item.ticker}</span>
              <span className="text-zinc-400 text-extrasmall">
                {item.exchange} · sugerowane {formatPrice(item.suggestedEntryPrice)}
              </span>
            </div>
            <input
              type="number"
              step="0.0001"
              className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none tabular-nums w-24"
              placeholder="cena zakupu"
              value={prices[item.id] ?? ""}
              onChange={(e) => setPrices((prev) => ({ ...prev, [item.id]: e.target.value }))}
              autoComplete="off"
            />
          </div>
        ))}
      </div>

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
          potwierdź
        </button>
      </div>
    </Modal>
  );
}
