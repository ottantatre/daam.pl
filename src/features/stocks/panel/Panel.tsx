"use client";

import { Cog, History, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { StockCard } from "../common";
import { StockSet } from "../types";
import { HistorySection } from "./HistorySection";
import { SettingsSection } from "./SettingsSection";

type Option = "history" | "settings";

interface Props {
  closedSets: StockSet[];
}

export default function StocksPanel({ closedSets }: Props) {
  const [activeOption, setActiveOption] = useState<Option | null>("history");

  const handleOptionClick = (option: Option) => () => {
    setActiveOption((prev) => (prev === option ? null : option));
  };

  return (
    <div className="shrink-0 flex text-small">
      <StockCard className="gap-2 flex-row">
        <div className="flex flex-col gap-1 h-full">
          <ActionButton active={activeOption === "settings"} icon={Cog} onClick={handleOptionClick("settings")} />
          <ActionButton active={activeOption === "history"} icon={History} onClick={handleOptionClick("history")} />
        </div>
        {activeOption !== null && (
          <div className="border-l border-zinc-300 pl-2 flex flex-col">
            {activeOption === "history" && <HistorySection sets={closedSets} />}
            {activeOption === "settings" && <SettingsSection />}
          </div>
        )}
      </StockCard>
    </div>
  );
}

function ActionButton({
  active,
  onClick,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}) {
  return (
    <button
      className={cn("p-0.5 text-zinc-500 hover:text-zinc-700 cursor-pointer", {
        "bg-zinc-300 text-zinc-700 hover:text-zinc-900": active,
      })}
      onClick={onClick}
    >
      <Icon size={16} strokeWidth={1.5} />
    </button>
  );
}
