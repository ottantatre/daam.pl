import { DAYS_SHORT, MONTHS } from "./calendarUtils";
import { CalendarCard } from "./common";

type Props = {
  dayTarget: Date;
};

export default function DayView({ dayTarget }: Props) {
  return (
    <div className="flex p-2 basis-full">
      <CalendarCard>
        <div className="uppercase tracking-widest text-zinc-400 mb-1">{DAYS_SHORT[(dayTarget.getDay() + 6) % 7]}</div>
        <div className="text-xs text-zinc-900 underline">
          {dayTarget.getDate()} {MONTHS[dayTarget.getMonth()]} {dayTarget.getFullYear()}
        </div>
      </CalendarCard>
    </div>
  );
}
