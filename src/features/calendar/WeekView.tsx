import { cn } from "@/lib/cn";
import { DAYS_SHORT, getDayStatus } from "./calendarUtils";
import { CalendarCard } from "./common";

type Props = {
  weekDays: Date[];
  onDayClick: (day: Date) => void;
};

export default function WeekView({ weekDays, onDayClick }: Props) {
  return (
    <div className="flex-1 grid grid-cols-7 gap-2 px-2">
      {weekDays.map((day, i) => {
        const { isToday, isPast, isFuture } = getDayStatus(day);

        return (
          <div key={i} onClick={() => onDayClick(day)} className={`flex py-2 text-[10px] cursor-pointer `}>
            <CalendarCard
              className={cn("group", {
                "bg-zinc-200 hover:bg-zinc-300": isToday,
                "opacity-45 hover:opacity-90": isPast,
                "hover:bg-zinc-200": isFuture,
              })}
            >
              <div className="flex justify-between">
                <div className="uppercase tracking-wide text-zinc-400">{DAYS_SHORT[i]}</div>
                <div
                  className={cn("text-xs", {
                    "text-zinc-600 group-hover:text-zinc-800 underline": isToday,
                    "text-zinc-500 group-hover:text-zinc-700": !isToday,
                  })}
                >
                  {day.getDate()}
                </div>
              </div>
            </CalendarCard>
          </div>
        );
      })}
    </div>
  );
}
