"use client";

import { CalendarDays, Cog, LucideProps } from "lucide-react";
import { CalendarCard } from "../common";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { cn } from "@/lib/cn";
import { UserCalendar } from "../types";
import { CalendarLists } from "./CalenderLists";
import { NewCalendarModal } from "./NewCalendarModal";
import { EditCalendarModal } from "./EditCalendarModal";
import { DeleteCalendarModal } from "./DeleteCalendarModal";

type Option = "calendars" | "settings";

interface CalendarPanelProps {
  calendars: UserCalendar[];
  visibleIds: Set<string>;
  onToggle: (id: string) => void;
}

export default function CalendarPanel({ calendars, visibleIds, onToggle }: CalendarPanelProps) {
  const [activeOption, setActiveOption] = useState<Option | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editCalendar, setEditCalendar] = useState<UserCalendar | null>(null);
  const [deleteCalendar, setDeleteCalendar] = useState<UserCalendar | null>(null);

  const handleOptionClick = (option: Option) => () => {
    setActiveOption((prev) => (prev === option ? null : option));
  };

  return (
    <div className="shrink-0 flex text-small">
      <CalendarCard className="gap-2 flex-row">
        <div className="flex flex-col gap-1 h-full">
          <ActionButton active={activeOption === "settings"} icon={Cog} onClick={handleOptionClick("settings")} />
          <ActionButton active={activeOption === "calendars"} icon={CalendarDays} onClick={handleOptionClick("calendars")} />
        </div>
        {activeOption !== null && (
          <div className="border-l border-zinc-300 pl-2 flex flex-col">
            {activeOption === "calendars" && (
              <CalendarLists
                calendars={calendars}
                visibleIds={visibleIds}
                onToggle={onToggle}
                onAdd={() => setShowModal(true)}
                onShare={() => {}}
                onEdit={(cal) => setEditCalendar(cal)}
                onDelete={(cal) => setDeleteCalendar(cal)}
              />
            )}
            {activeOption === "settings" && <div>Settings</div>}
          </div>
        )}
      </CalendarCard>
      {showModal && <NewCalendarModal usedColors={calendars.map((c) => c.color)} onClose={() => setShowModal(false)} />}
      {editCalendar && (
        <EditCalendarModal
          calendar={editCalendar}
          usedColors={calendars.map((c) => c.color)}
          onClose={() => setEditCalendar(null)}
        />
      )}
      {deleteCalendar && <DeleteCalendarModal calendar={deleteCalendar} onClose={() => setDeleteCalendar(null)} />}
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
