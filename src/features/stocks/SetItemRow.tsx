import { cn } from "@/lib/utils";
import { formatPrice, formatPct } from "./stockUtils";
import { SetItem, itemPnlPct } from "./types";

export function ItemRowProposed({ item }: { item: SetItem }) {
  return (
    <div className="grid grid-cols-[2rem_5rem_2.5rem_4rem_4rem_1fr] gap-x-2 items-center px-1 py-0.5 hover:bg-zinc-100">
      <span className="text-zinc-400 tabular-nums text-extrasmall">{item.rank || ""}</span>
      <span className="text-zinc-700 truncate">{item.ticker}</span>
      <span className="text-zinc-400 text-extrasmall">{item.exchange}</span>
      <span className="tabular-nums text-zinc-600 text-right" title="suggested entry">
        {formatPrice(item.suggestedEntryPrice)}
      </span>
      <span className="tabular-nums text-zinc-400 text-right text-extrasmall" title="suggested stop loss">
        SL {formatPrice(item.suggestedStopLoss)}
      </span>
      <span className="text-zinc-500 truncate text-extrasmall">{item.rationale ?? ""}</span>
    </div>
  );
}

export function ItemRowActive({ item, onLoss }: { item: SetItem; onLoss: (item: SetItem) => void }) {
  const pct = itemPnlPct(item);
  const isStoppedOut = item.status === "stopped_out";
  const isClosed = item.status === "closed_with_set";
  const showLossBtn = item.status === "open";

  return (
    <div className="grid grid-cols-[5rem_2.5rem_4rem_4rem_4rem_1fr_auto] gap-x-2 items-center px-1 py-0.5 hover:bg-zinc-100">
      <span className={cn("truncate", isStoppedOut ? "text-zinc-400 line-through" : "text-zinc-700")}>{item.ticker}</span>
      <span className="text-zinc-400 text-extrasmall">{item.exchange}</span>
      <span className="tabular-nums text-zinc-600 text-right" title="actual entry">
        {item.actualEntryPrice !== null ? formatPrice(item.actualEntryPrice) : "—"}
      </span>
      <span className="tabular-nums text-zinc-400 text-right text-extrasmall" title="stop loss">
        SL {formatPrice(item.suggestedStopLoss)}
      </span>
      <span className="tabular-nums text-zinc-500 text-right text-extrasmall" title="exit">
        {item.actualExitPrice !== null ? formatPrice(item.actualExitPrice) : "—"}
      </span>
      <span
        className={cn("tabular-nums text-extrasmall", {
          "text-zinc-700": pct !== null && pct > 0,
          "text-zinc-400": pct !== null && pct <= 0,
          "text-zinc-500": pct === null,
        })}
      >
        {pct !== null ? formatPct(pct) : isClosed ? "—" : "open"}
      </span>
      {showLossBtn ? (
        <button
          className="text-zinc-400 hover:text-zinc-700 cursor-pointer text-extrasmall underline"
          onClick={() => onLoss(item)}
          title="zamknij na stop loss"
        >
          loss
        </button>
      ) : (
        <span className="text-zinc-400 text-extrasmall">{item.exitReason === "stop_loss" ? "SL" : "—"}</span>
      )}
    </div>
  );
}
