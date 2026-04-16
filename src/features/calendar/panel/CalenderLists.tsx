import { CalendarPlus } from "lucide-react";
import { UserCalendar } from "../types";
import { CalendarList } from "./CalendarList";

export function CalendarLists({
  calendars,
  visibleIds,
  onToggle,
  onAdd,
}: {
  calendars: UserCalendar[];
  visibleIds: Set<string>;
  onToggle: (id: string) => void;
  onAdd: () => void;
}) {
  const own = calendars.filter((c) => c.role === "author");
  const shared = calendars.filter((c) => c.role !== "author");

  return (
    <div className="flex flex-col gap-2 min-w-30 h-full">
      <div className="flex flex-col gap-1 flex-1">
        <CalendarList owner="owned" calendars={own} visibleIds={visibleIds} onToggle={onToggle} />
        <div className="border-b border-zinc-300" />
        <CalendarList owner="shared" calendars={shared} visibleIds={visibleIds} onToggle={onToggle} />
      </div>
      <button onClick={onAdd} className="flex items-center gap-1 text-zinc-500 hover:text-zinc-700 cursor-pointer">
        <CalendarPlus size={12} />
        NEW
      </button>
    </div>
  );
}
