"use client";

import { useState } from "react";
import { SectionLabel, StockCard } from "./common";
import { SetItem, StockSet, setAggregatePnlPct } from "./types";
import { formatPct, formatTime } from "./stockUtils";
import { ItemRowActive } from "./SetItemRow";
import { SoldSetModal } from "./SoldSetModal";
import { LossPositionModal } from "./LossPositionModal";
import { cn } from "@/lib/utils";

interface Props {
  sets: StockSet[];
}

export default function ActiveSetsView({ sets }: Props) {
  const [sellingSet, setSellingSet] = useState<StockSet | null>(null);
  const [lossItem, setLossItem] = useState<SetItem | null>(null);

  return (
    <div className="flex basis-full">
      <StockCard className="gap-2">
        <div className="flex items-center gap-2">
          <SectionLabel>aktywne</SectionLabel>
          <span className="text-zinc-400 tabular-nums text-extrasmall">· {sets.length}</span>
        </div>

        {sets.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-zinc-400 text-extrasmall">brak aktywnych zestawów</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 overflow-y-auto">
            {sets.map((set, idx) => {
              const aggregate = setAggregatePnlPct(set);
              const allClosed = set.items.every((i) => i.status !== "open");
              const hitTarget = aggregate >= set.targetPct;
              return (
                <div key={set.id} className="flex flex-col gap-1 border-l-2 border-zinc-300 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 uppercase tracking-widest text-extrasmall">
                      set #{sets.length - idx}
                    </span>
                    {set.boughtAt && (
                      <span className="text-zinc-400 text-extrasmall tabular-nums">· {formatTime(set.boughtAt)}</span>
                    )}
                    <span
                      className={cn("text-extrasmall tabular-nums", {
                        "text-zinc-700": hitTarget,
                        "text-zinc-500": !hitTarget && aggregate >= 0,
                        "text-zinc-400": aggregate < 0,
                      })}
                    >
                      · agg {formatPct(aggregate)}
                    </span>
                    {hitTarget && <span className="text-zinc-700 text-extrasmall uppercase tracking-widest">target</span>}
                    <div className="flex-1" />
                    <button
                      className="text-zinc-700 hover:text-zinc-900 cursor-pointer text-extrasmall underline disabled:opacity-40"
                      disabled={allClosed}
                      onClick={() => setSellingSet(set)}
                    >
                      sold
                    </button>
                  </div>
                  <div className="flex flex-col">
                    {set.items.map((item) => (
                      <ItemRowActive key={item.id} item={item} onLoss={setLossItem} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </StockCard>

      {sellingSet && <SoldSetModal set={sellingSet} onClose={() => setSellingSet(null)} />}
      {lossItem && <LossPositionModal item={lossItem} onClose={() => setLossItem(null)} />}
    </div>
  );
}
