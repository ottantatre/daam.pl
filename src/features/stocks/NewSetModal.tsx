"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { createClient } from "@/lib/supabase/client";
import { useAsyncRefresh } from "@/lib/useAsyncRefresh";
import { parseXtbSymbol } from "./stockUtils";

type Draft = {
  symbol: string;
  entry: string;
  sl: string;
  rationale: string;
};

const emptyDraft = (): Draft => ({ symbol: "", entry: "", sl: "", rationale: "" });

export function NewSetModal({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<Draft[]>([emptyDraft(), emptyDraft(), emptyDraft()]);
  const [targetPct, setTargetPct] = useState("1.0");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPending, refresh } = useAsyncRefresh(onClose);

  const busy = fetching || isPending;

  const updateItem = (i: number, patch: Partial<Draft>) => {
    setItems((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const addItem = () => setItems((prev) => [...prev, emptyDraft()]);

  const parsedItems = items.map((d) => {
    const parsed = parseXtbSymbol(d.symbol);
    const entry = Number(d.entry);
    const sl = Number(d.sl);
    return {
      draft: d,
      parsed,
      entry,
      sl,
      valid: !!parsed && entry > 0 && sl > 0 && sl < entry,
    };
  });

  const target = Number(targetPct);
  const allValid = parsedItems.length > 0 && parsedItems.every((p) => p.valid) && target > 0;
  const disabled = !allValid || busy;

  const handleCreate = async () => {
    if (disabled) return;
    setFetching(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Brak sesji");
      setFetching(false);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const scanRes = await supabase
      .from("stock_scans")
      .insert({ user_id: user.id, scan_date: today, triggered_by: "manual", status: "complete" })
      .select()
      .single();
    if (scanRes.error || !scanRes.data) {
      setError(scanRes.error?.message ?? "Scan insert failed");
      setFetching(false);
      return;
    }

    const setRes = await supabase
      .from("stock_sets")
      .insert({ user_id: user.id, scan_id: scanRes.data.id, status: "proposed", target_pct: target })
      .select()
      .single();
    if (setRes.error || !setRes.data) {
      setError(setRes.error?.message ?? "Set insert failed");
      setFetching(false);
      return;
    }

    const itemsToInsert = parsedItems.map((p, i) => ({
      user_id: user.id,
      set_id: setRes.data.id,
      ticker: p.parsed!.ticker,
      xtb_symbol: p.draft.symbol.trim().toUpperCase(),
      exchange: p.parsed!.exchange,
      rank: i + 1,
      suggested_entry_price: p.entry,
      suggested_stop_loss: p.sl,
      rationale: p.draft.rationale.trim() || null,
      status: "pending" as const,
    }));
    const itemsRes = await supabase.from("stock_set_items").insert(itemsToInsert);
    if (itemsRes.error) {
      setError(itemsRes.error.message);
      setFetching(false);
      return;
    }

    setFetching(false);
    refresh();
  };

  return (
    <Modal onClose={onClose}>
      <span className="text-zinc-500 uppercase tracking-wider text-extrasmall">Nowy zestaw</span>

      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {parsedItems.map((p, i) => (
          <div key={i} className="flex flex-col gap-1 border-l-2 border-zinc-300 pl-2">
            <div className="flex items-center gap-1">
              <input
                className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none placeholder:text-zinc-400 uppercase flex-1"
                placeholder="symbol XTB (np. SAP.DE)"
                value={p.draft.symbol}
                onChange={(e) => updateItem(i, { symbol: e.target.value })}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
              {items.length > 1 && (
                <button className="text-zinc-400 hover:text-zinc-700 cursor-pointer p-1" onClick={() => removeItem(i)}>
                  <X size={12} strokeWidth={1.5} />
                </button>
              )}
            </div>
            <div className="flex gap-1">
              <input
                type="number"
                step="0.0001"
                className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none tabular-nums flex-1"
                placeholder="entry"
                value={p.draft.entry}
                onChange={(e) => updateItem(i, { entry: e.target.value })}
                autoComplete="off"
              />
              <input
                type="number"
                step="0.0001"
                className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none tabular-nums flex-1"
                placeholder="stop loss"
                value={p.draft.sl}
                onChange={(e) => updateItem(i, { sl: e.target.value })}
                autoComplete="off"
              />
            </div>
            <input
              className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none placeholder:text-zinc-400 text-extrasmall"
              placeholder="rationale (opcjonalnie)"
              value={p.draft.rationale}
              onChange={(e) => updateItem(i, { rationale: e.target.value })}
              autoComplete="off"
            />
            {p.draft.symbol && !p.parsed && (
              <span className="text-red-500 text-extrasmall">Format: TICKER.GIEŁDA</span>
            )}
            {p.draft.entry && p.draft.sl && p.parsed && !p.valid && (
              <span className="text-red-500 text-extrasmall">SL musi być &lt; entry, oba &gt; 0</span>
            )}
          </div>
        ))}
      </div>

      <button
        className="flex items-center gap-1 text-zinc-500 hover:text-zinc-800 cursor-pointer text-extrasmall"
        onClick={addItem}
      >
        <Plus size={12} strokeWidth={1.5} />
        <span>dodaj ticker</span>
      </button>

      <div className="flex items-center gap-2">
        <span className="uppercase tracking-widest text-extrasmall text-zinc-400">cel</span>
        <input
          type="number"
          step="0.1"
          className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none tabular-nums w-16"
          value={targetPct}
          onChange={(e) => setTargetPct(e.target.value)}
          autoComplete="off"
        />
        <span className="text-zinc-500 text-extrasmall">%</span>
      </div>

      {error && <span className="text-red-500 text-extrasmall">{error}</span>}

      <div className="flex gap-2 justify-end">
        <button className="text-zinc-400 hover:text-zinc-600 cursor-pointer" disabled={busy} onClick={onClose}>
          anuluj
        </button>
        <button
          className="text-zinc-700 hover:text-zinc-900 cursor-pointer disabled:opacity-40"
          disabled={disabled}
          onClick={handleCreate}
        >
          utwórz
        </button>
      </div>
    </Modal>
  );
}
