"use client";

import { useMemo } from "react";
import StocksPanel from "./panel/Panel";
import ProposedSetsView from "./ProposedSetsView";
import ActiveSetsView from "./ActiveSetsView";
import { StockSet } from "./types";

interface Props {
  rowSpan?: number;
  sets: StockSet[];
}

export default function Stocks({ rowSpan = 2, sets }: Props) {
  const proposed = useMemo(() => sets.filter((s) => s.status === "proposed"), [sets]);
  const active = useMemo(() => sets.filter((s) => s.status === "bought"), [sets]);
  const closed = useMemo(() => sets.filter((s) => s.status === "sold" || s.status === "skipped"), [sets]);

  return (
    <div style={{ gridColumn: "1 / -1", gridRow: `1 / ${rowSpan + 1}` }} className="flex overflow-hidden p-2 gap-2">
      <StocksPanel closedSets={closed} />
      <ProposedSetsView sets={proposed} />
      <ActiveSetsView sets={active} />
    </div>
  );
}
