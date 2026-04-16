import { UserCalendar } from "../types";
import { CalendarRow } from "./CalendarRow";

interface Props {
  owner: "owned" | "shared";
  calendars: UserCalendar[];
  visibleIds: Set<string>;
  onToggle: (id: string) => void;
}

export function CalendarList({ owner, calendars, visibleIds, onToggle }: Props) {
  if (calendars.length === 0) return <span className="text-zinc-400 text-extrasmall">{`No ${owner} calendars`}</span>;

  return (
    <div className="flex flex-col gap-1">
      {calendars.map((cal) => (
        <CalendarRow key={cal.id} calendar={cal} checked={visibleIds.has(cal.id)} onToggle={() => onToggle(cal.id)} />
      ))}
    </div>
  );
}
