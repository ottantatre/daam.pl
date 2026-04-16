import { UserCalendar } from "../types";
import { CalendarList } from "./CalendarList";
import { AddNewCalendarButton } from "./CalendarRow";

export function CalendarLists({
  calendars,
  visibleIds,
  onToggle,
  onAdd,
  onShare,
  onEdit,
  onDelete,
}: {
  calendars: UserCalendar[];
  visibleIds: Set<string>;
  onToggle: (id: string) => void;
  onAdd: () => void;
  onShare?: (calendar: UserCalendar) => void;
  onEdit?: (calendar: UserCalendar) => void;
  onDelete?: (calendar: UserCalendar) => void;
}) {
  const own = calendars.filter((c) => c.role === "author");
  const shared = calendars.filter((c) => c.role !== "author");

  return (
    <div className="flex flex-col gap-2 min-w-30 h-full">
      <div className="flex flex-col gap-1 flex-1">
        <CalendarList
          owner="owned"
          calendars={own}
          visibleIds={visibleIds}
          onToggle={onToggle}
          onShare={onShare}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <div className="border-b border-zinc-300" />
        <CalendarList
          owner="shared"
          calendars={shared}
          visibleIds={visibleIds}
          onToggle={onToggle}
          onShare={onShare}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
      <AddNewCalendarButton onAdd={onAdd} />
    </div>
  );
}
