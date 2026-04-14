import { CalendarDays, Cog, LucideProps } from "lucide-react";
import { CalendarCard } from "./common";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { cn } from "@/lib/cn";

type Option = "calendars" | "settings";

export default function CalendarPanel() {
  const [activeOption, setActiveOption] = useState<Option | null>(null);

  const handleOptionClick = (option: Option) => () => {
    setActiveOption((prev) => (prev === option ? null : option));
  };

  return (
    <div className="shrink-0 flex text-[10px]">
      <CalendarCard className="gap-2 flex-row">
        <div className="flex flex-col gap-1.25 h-full">
          <ActionButton active={activeOption === "settings"} icon={Cog} onClick={handleOptionClick("settings")} />

          <ActionButton active={activeOption === "calendars"} icon={CalendarDays} onClick={handleOptionClick("calendars")} />
        </div>
        {activeOption !== null && (
          <div className="border-l border-zinc-300 pl-2">
            {activeOption === "calendars" && <div>Calendars</div>}
            {activeOption === "settings" && <div>Settings</div>}
          </div>
        )}
      </CalendarCard>
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
        "bg-zinc-500 text-zinc-50 hover:bg-zinc-600 hover:text-zinc-100": active,
      })}
      onClick={onClick}
    >
      <Icon size={16} strokeWidth={1.5} />
    </button>
  );
}
