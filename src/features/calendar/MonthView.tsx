import { ArrowLeft, ArrowRight } from "lucide-react";
import { DAYS_SHORT, MONTHS, isSameDay } from "./calendarUtils";
import { CalendarCard } from "./common";
import { cn } from "@/lib/cn";

type Props = {
  displayYear: number;
  displayMonth: number;
  monthGrid: (number | null)[][];
  today: Date;
  view: "week" | "day";
  focusedDay: Date | null;
  dayTarget: Date;
  onShiftMonth: (delta: -1 | 1) => void;
  onDayClick: (day: number) => void;
};

export default function MonthView({
  displayYear,
  displayMonth,
  monthGrid,
  today,
  view,
  focusedDay,
  dayTarget,
  onShiftMonth,
  onDayClick,
}: Props) {
  return (
    <div className="shrink-0 flex text-small">
      <CalendarCard className="gap-2">
        <div className="flex items-center gap-1 h-4">
          <button
            onClick={() => onShiftMonth(-1)}
            className="flex items-center justify-center w-4 h-4 text-zinc-400 hover:text-zinc-900 leading-none cursor-pointer"
          >
            <ArrowLeft size={10} />
          </button>
          <div className="uppercase tracking-widest text-zinc-500 flex-1 text-center">
            {MONTHS[displayMonth]} {displayYear}
          </div>
          <button
            onClick={() => onShiftMonth(1)}
            className="flex items-center justify-center w-4 h-4 text-zinc-400 hover:text-zinc-900 leading-none cursor-pointer"
          >
            <ArrowRight size={10} />
          </button>
        </div>
        <div className="flex flex-col gap-y-0.5 leading-4">
          <div className="flex gap-x-1.5">
            {DAYS_SHORT.map((d) => (
              <div key={d} className="uppercase tracking-widest text-zinc-400 text-center w-5">
                {d}
              </div>
            ))}
          </div>
          {monthGrid.map((week, wi) => {
            const isSelectedWeek =
              view === "week" &&
              focusedDay !== null &&
              week.some((day) => day !== null && isSameDay(new Date(displayYear, displayMonth, day), focusedDay));
            const isDayWeek =
              view === "day" && week.some((day) => day !== null && isSameDay(new Date(displayYear, displayMonth, day), dayTarget));
            return (
              <div key={wi} className={cn("flex gap-x-1.5 rounded", isSelectedWeek && "bg-zinc-300", isDayWeek && "bg-zinc-200")}>
                {week.map((day, di) => {
                  const isToday = day === today.getDate() && displayMonth === today.getMonth() && displayYear === today.getFullYear();
                  return (
                    <div
                      key={di}
                      onClick={day ? () => onDayClick(day) : undefined}
                      className={cn(
                        "text-center w-5",
                        day && "cursor-pointer",
                        isSelectedWeek && day && "text-zinc-900",
                        isDayWeek && day && "text-zinc-700",
                        day && !(isSelectedWeek || isDayWeek) && "text-zinc-500 hover:text-zinc-900",
                        isToday && "text-zinc-900 underline",
                      )}
                    >
                      {day ?? ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CalendarCard>
    </div>
  );
}
