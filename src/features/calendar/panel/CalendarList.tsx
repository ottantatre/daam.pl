import { UserCalendar } from "../types";
import { CalendarRow } from "./CalendarRow";

interface Props {
  owner: "owned" | "shared";
  calendars: UserCalendar[];
  visibleIds: Set<string>;
  onToggle: (id: string) => void;
  onShare?: (calendar: UserCalendar) => void;
  onEdit?: (calendar: UserCalendar) => void;
  onDelete?: (calendar: UserCalendar) => void;
}

export function CalendarList({ owner, calendars, visibleIds, onToggle, onShare, onEdit, onDelete }: Props) {
  if (calendars.length === 0) return <span className="text-zinc-400 text-extrasmall">{`No ${owner} calendars`}</span>;

  return (
    <div className="flex flex-col gap-1">
      {calendars.map((cal) => (
        <CalendarRow
          key={cal.id}
          calendar={cal}
          checked={visibleIds.has(cal.id)}
          onToggle={() => onToggle(cal.id)}
          onShare={() => onShare?.(cal)}
          onEdit={() => onEdit?.(cal)}
          onDelete={() => onDelete?.(cal)}
        />
      ))}
    </div>
  );
}
