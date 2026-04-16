import { cn } from "@/lib/cn";
import { UserCalendar } from "../types";

interface Props {
  calendar: UserCalendar;
  checked: boolean;
  onToggle: () => void;
}

export function CalendarRow({ calendar, checked, onToggle }: Props) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer group">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onToggle} />
      <span
        className={cn("w-2.5 h-2.5 shrink-0 border")}
        style={{
          backgroundColor: checked ? calendar.color : "transparent",
          borderColor: calendar.color,
        }}
      />
      <span className="text-zinc-600 group-hover:text-zinc-800 truncate max-w-25">{calendar.name}</span>
    </label>
  );
}
