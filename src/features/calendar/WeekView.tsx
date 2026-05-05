import { cn } from "@/lib/cn";
import { DAYS_SHORT, formatDateISO, getDayStatus } from "./calendarUtils";
import { CalendarCard } from "./common";
import { Plus } from "lucide-react";
import { UserCalendar } from "./types";

type Props = {
  weekDays: Date[];
  calendars: UserCalendar[];
  onDayClick: (day: Date) => void;
  onAddEvent: (day: Date) => void;
};

type DayEvent = { id: string; title: string; start: string; end: string; color: string };

function eventsForDay(calendars: UserCalendar[], day: Date): DayEvent[] {
  const iso = formatDateISO(day);
  const items: DayEvent[] = [];
  for (const c of calendars) {
    for (const e of c.events) {
      if (e.date === iso) items.push({ id: e.id, title: e.title, start: e.start, end: e.end, color: c.color });
    }
  }
  return items.sort((a, b) => a.start.localeCompare(b.start));
}

export default function WeekView({ weekDays, calendars, onDayClick, onAddEvent }: Props) {
  return (
    <div className="flex-1 grid grid-cols-7 gap-2">
      {weekDays.map((day, i) => {
        const { isToday, isPast, isFuture } = getDayStatus(day);
        const events = eventsForDay(calendars, day);

        return (
          <div key={i} onClick={() => onDayClick(day)} className={`flex text-small cursor-pointer `}>
            <CalendarCard
              className={cn("group gap-1", {
                "bg-zinc-200 hover:bg-zinc-300": isToday,
                "opacity-45 hover:opacity-90": isPast,
                "hover:bg-zinc-200": isFuture,
              })}
            >
              <div className="flex justify-between relative">
                <div className="flex gap-2 items-end ">
                  <span
                    className={cn("text-medium", {
                      "text-zinc-600 group-hover:text-zinc-800 underline": isToday,
                      "text-zinc-500 group-hover:text-zinc-700": !isToday,
                    })}
                  >
                    {day.getDate()}
                  </span>
                  <span className="uppercase tracking-wide text-zinc-400">{DAYS_SHORT[i]}</span>
                </div>
                {!isPast && (
                  <div className="absolute -top-1 -right-1">
                    <button
                      className="p-0.5 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-300 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddEvent(day);
                      }}
                    >
                      <Plus size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {events.map((e) => (
                  <div key={e.id} className="flex items-center gap-1 text-extrasmall min-w-0" title={`${e.title} ${e.start}–${e.end}`}>
                    <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: e.color }} />
                    <span className="text-zinc-400 tabular-nums shrink-0">{e.start}</span>
                    <span className="truncate text-zinc-600">{e.title}</span>
                  </div>
                ))}
              </div>
            </CalendarCard>
          </div>
        );
      })}
    </div>
  );
}
