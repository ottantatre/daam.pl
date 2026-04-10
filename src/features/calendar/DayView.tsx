import { cn } from "@/lib/cn";
import { DAYS_LONG, MONTHS } from "./calendarUtils";
import { CalendarCard } from "./common";

type Props = {
  dayTarget: Date;
};

export default function DayView({ dayTarget }: Props) {
  return (
    <div className="flex p-2 basis-full">
      <CalendarCard className="gap-2">
        <div className="flex gap-2 text-xs items-end">
          <span className="text-zinc-600">
            {dayTarget.getDate()} {MONTHS[dayTarget.getMonth()]} {dayTarget.getFullYear()}
          </span>
          <span className="uppercase text-[10px] text-zinc-400">{DAYS_LONG[(dayTarget.getDay() + 6) % 7]}</span>
        </div>
        <div className="grid grid-cols-24 flex-1 gap-px bg-zinc-300 overflow-x-auto">
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="flex flex-col items-start min-w-10 bg-zinc-200 relative">
              <span
                className={cn("text-[10px] bg-zinc-200 text-zinc-400 absolute bottom-0 -right-2 w-4 z-1 text-center", { hidden: h === 23 })}
              >
                {String(h + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </CalendarCard>
    </div>
  );
}
