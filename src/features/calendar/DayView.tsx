import { cn } from "@/lib/cn";
import { DAYS_LONG, MONTHS } from "./calendarUtils";
import { CalendarCard } from "./common";
import { eventPosition, UserCalendar } from "./types";

type Props = {
  dayTarget: Date;
  calendars?: UserCalendar[];
};

export default function DayView({ dayTarget, calendars = [] }: Props) {
  const dateStr = dayTarget.toISOString().slice(0, 10);

  return (
    <div className="flex basis-full">
      <CalendarCard className="gap-2">
        <div className="flex gap-2 text-xs items-end">
          <span className="text-zinc-600">
            {dayTarget.getDate()} {MONTHS[dayTarget.getMonth()]} {dayTarget.getFullYear()}
          </span>
          <span className="uppercase text-[10px] text-zinc-400">{DAYS_LONG[(dayTarget.getDay() + 6) % 7]}</span>
        </div>

        <div className="relative overflow-x-auto flex-1">
          {/* hour grid */}
          <div className="grid grid-cols-24 gap-px bg-zinc-300 h-full">
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="flex flex-col items-start min-w-10 bg-zinc-200 relative">
                <span
                  className={cn("text-[10px] bg-zinc-200 text-zinc-400 absolute bottom-0 -right-2 w-4 z-1 text-center", {
                    hidden: h === 23,
                  })}
                >
                  {String(h + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>

          {/* event rows overlay */}
          <div className="absolute inset-0 flex flex-col pointer-events-none gap-0.5">
            {calendars.map((cal) => (
              <div key={cal.id} className="relative h-3">
                {cal.events
                  .filter((e) => e.date === dateStr)
                  .map((event) => {
                    const { left, width } = eventPosition(event.start, event.end);
                    return (
                      <div
                        key={event.id}
                        title={event.title}
                        className="absolute top-0 h-full"
                        style={{ left, width, backgroundColor: cal.color }}
                      />
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </CalendarCard>
    </div>
  );
}
