"use client";

import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { cn } from "@/lib/cn";
import { UserCalendar } from "../types";
import { CalendarContextMenu } from "./CalendarContextMenu";

interface Props {
  calendar: UserCalendar;
  checked: boolean;
  onToggle: () => void;
  onShare?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CalendarRow({ calendar, checked, onToggle, onShare, onEdit, onDelete }: Props) {
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 2, left: rect.left });
  };

  return (
    <>
      <div className="flex items-center gap-1.5 group">
        <label className="flex items-center gap-1.5 cursor-pointer flex-1 min-w-0">
          <input type="checkbox" className="sr-only" checked={checked} onChange={onToggle} />
          <span
            className={cn("w-2.5 h-2.5 shrink-0 border")}
            style={{
              backgroundColor: checked ? calendar.color : "transparent",
              borderColor: calendar.color,
            }}
          />
          <span className="text-zinc-600 group-hover:text-zinc-800 truncate">{calendar.name}</span>
        </label>
        <button
          className={cn("text-zinc-400 hover:text-zinc-700 hover:bg-zinc-300 cursor-pointer p-px", {
            "bg-zinc-300 text-zinc-700": menuPos,
          })}
          onClick={handleMenuClick}
        >
          <EllipsisVertical size={12} strokeWidth={1.5} />
        </button>
      </div>
      {menuPos && (
        <CalendarContextMenu
          top={menuPos.top}
          left={menuPos.left}
          onShare={() => onShare?.()}
          onEdit={() => onEdit?.()}
          onDelete={() => onDelete?.()}
          onClose={() => setMenuPos(null)}
        />
      )}
    </>
  );
}

export function AddNewCalendarButton({ onAdd }: { onAdd: () => void }) {
  return (
    <button className="flex items-center gap-1.5 group" onClick={onAdd}>
      <span className="flex items-center gap-1.5 cursor-pointer flex-1 min-w-0">
        <span className={cn("w-2.5 h-2.5 shrink-0 border border-zinc-400 group-hover:border-zinc-500")} />
        <span className="text-zinc-500 group-hover:text-zinc-800 truncate">New calendar</span>
      </span>
    </button>
  );
}
