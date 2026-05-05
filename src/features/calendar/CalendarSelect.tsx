"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { UserCalendar } from "./types";

type Props = {
  calendars: UserCalendar[];
  value: string;
  onChange: (id: string) => void;
};

export function CalendarSelect({ calendars, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = calendars.find((c) => c.id === value);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none w-full flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          <>
            <span className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: selected.color }} />
            <span className="truncate flex-1 text-left">{selected.name}</span>
          </>
        ) : (
          <span className="text-zinc-400 flex-1 text-left">wybierz kalendarz</span>
        )}
        <ChevronDown size={12} strokeWidth={1.5} className="text-zinc-500 shrink-0" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-px bg-zinc-100 flex flex-col shadow-sm z-10 max-h-40 overflow-auto">
          {calendars.map((c) => (
            <button
              key={c.id}
              type="button"
              className={cn(
                "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-zinc-200 text-left",
                c.id === value && "bg-zinc-200",
              )}
              onClick={() => {
                onChange(c.id);
                setOpen(false);
              }}
            >
              <span className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: c.color }} />
              <span className="truncate text-zinc-700 flex-1">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
