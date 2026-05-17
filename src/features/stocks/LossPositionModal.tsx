"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { createClient } from "@/lib/supabase/client";
import { useAsyncRefresh } from "@/lib/useAsyncRefresh";
import { SetItem } from "./types";
import { formatPct, formatPrice } from "./stockUtils";

export function LossPositionModal({ item, onClose }: { item: SetItem; onClose: () => void }) {
  const [exitPrice, setExitPrice] = useState<string>(String(item.suggestedStopLoss));
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPending, refresh } = useAsyncRefresh(onClose);

  const busy = fetching || isPending;
  const exit = Number(exitPrice);
  const valid = exit > 0;
  const disabled = !valid || busy;

  const entry = item.actualEntryPrice ?? item.suggestedEntryPrice;
  const previewPct = valid && entry ? ((exit - entry) / entry) * 100 : null;

  const handleConfirm = async () => {
    if (disabled) return;
    setFetching(true);
    setError(null);
    const supabase = createClient();
    const now = new Date().toISOString();
    const { error: err } = await supabase
      .from("stock_set_items")
      .update({
        actual_exit_price: exit,
        exit_reason: "stop_loss",
        status: "stopped_out",
        closed_at: now,
      })
      .eq("id", item.id);
    if (err) {
      setError(err.message);
      setFetching(false);
      return;
    }
    setFetching(false);
    refresh();
  };

  return (
    <Modal onClose={onClose}>
      <span className="text-zinc-500 uppercase tracking-wider text-extrasmall">Stop loss · {item.ticker}</span>

      <div className="flex flex-col gap-1">
        <span className="text-zinc-400 text-extrasmall">
          entry {formatPrice(entry)} · sugerowany SL {formatPrice(item.suggestedStopLoss)}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="uppercase tracking-widest text-extrasmall text-zinc-400">cena sprzedaży</span>
        <input
          type="number"
          step="0.0001"
          className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none tabular-nums"
          value={exitPrice}
          onChange={(e) => setExitPrice(e.target.value)}
          autoComplete="off"
          autoFocus
        />
      </div>

      {previewPct !== null && (
        <span className="text-zinc-500 text-extrasmall tabular-nums">P/L: {formatPct(previewPct)}</span>
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
          zamknij
        </button>
      </div>
    </Modal>
  );
}
