"use client";

import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { SectionLabel, StockCard } from "./common";
import { StockSet } from "./types";
import { ItemRowProposed } from "./SetItemRow";
import { NewSetModal } from "./NewSetModal";
import { BoughtSetModal } from "./BoughtSetModal";
import { useAsyncRefresh } from "@/lib/useAsyncRefresh";

interface Props {
  sets: StockSet[];
}

export default function ProposedSetsView({ sets }: Props) {
  const [showNew, setShowNew] = useState(false);
  const [buyingSet, setBuyingSet] = useState<StockSet | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const { isPending, refresh } = useAsyncRefresh(() => setScanError(null));

  const handleScan = async () => {
    setScanning(true);
    setScanError(null);
    const res = await fetch("/api/stocks/scan", { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Scan failed" }));
      setScanError(body.error ?? "Scan failed");
      setScanning(false);
      return;
    }
    setScanning(false);
    refresh();
  };

  const busy = scanning || isPending;

  return (
    <div className="flex basis-full">
      <StockCard className="gap-2">
        <div className="flex items-center gap-2">
          <SectionLabel>propozycje</SectionLabel>
          <span className="text-zinc-400 tabular-nums text-extrasmall">· {sets.length}</span>
          <div className="flex-1" />
          <button
            className="flex items-center gap-1 text-zinc-500 hover:text-zinc-800 cursor-pointer disabled:opacity-40"
            onClick={handleScan}
            disabled={busy}
            title="uruchom skaner XTB"
          >
            <Sparkles size={12} strokeWidth={1.5} />
            <span>{busy ? "skanuję…" : "skanuj"}</span>
          </button>
          <button
            className="flex items-center gap-1 text-zinc-500 hover:text-zinc-800 cursor-pointer"
            onClick={() => setShowNew(true)}
          >
            <Plus size={12} strokeWidth={1.5} />
            <span>zestaw</span>
          </button>
        </div>
        {scanError && <span className="text-red-500 text-extrasmall">{scanError}</span>}

        {sets.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-zinc-400 text-extrasmall">brak propozycji</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 overflow-y-auto">
            {sets.map((set, idx) => (
              <div key={set.id} className="flex flex-col gap-1 border-l-2 border-zinc-300 pl-2">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 uppercase tracking-widest text-extrasmall">set #{sets.length - idx}</span>
                  <span className="text-zinc-400 text-extrasmall tabular-nums">· {set.items.length} tickerów</span>
                  <span className="text-zinc-400 text-extrasmall tabular-nums">· cel +{set.targetPct.toFixed(2)}%</span>
                  <div className="flex-1" />
                  <button
                    className="text-zinc-700 hover:text-zinc-900 cursor-pointer text-extrasmall underline"
                    onClick={() => setBuyingSet(set)}
                  >
                    bought
                  </button>
                </div>
                <div className="flex flex-col">
                  {set.items.map((item) => (
                    <ItemRowProposed key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </StockCard>

      {showNew && <NewSetModal onClose={() => setShowNew(false)} />}
      {buyingSet && <BoughtSetModal set={buyingSet} onClose={() => setBuyingSet(null)} />}
    </div>
  );
}
