import { cn } from "@/lib/utils";
import { StockSet } from "../types";
import { formatPct } from "../stockUtils";

export function HistorySection({ sets }: { sets: StockSet[] }) {
  if (sets.length === 0) {
    return (
      <div className="flex flex-col min-w-30">
        <span className="text-zinc-400 text-extrasmall">brak zamkniętych zestawów</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 min-w-30 max-h-72 overflow-y-auto">
      {sets.map((set, idx) => {
        const pct = set.aggregatePnlPct;
        const isWin = pct !== null && pct > 0;
        const isLoss = pct !== null && pct < 0;
        return (
          <div key={set.id} className="flex items-center gap-1.5">
            <span className="text-zinc-600 flex-1 min-w-0 truncate uppercase tracking-widest text-extrasmall">
              #{sets.length - idx} · {set.items.length}
            </span>
            <span
              className={cn("tabular-nums text-extrasmall", {
                "text-zinc-700": isWin,
                "text-zinc-400": isLoss,
                "text-zinc-500": pct === null,
              })}
            >
              {pct === null ? "—" : formatPct(pct)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
