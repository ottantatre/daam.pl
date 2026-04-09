"use client";

import { useMemo, useState } from "react";

const DAYS_SHORT = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getMonthGrid(year: number, month: number): (number | null)[][] {
  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = (firstDow + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function getWeekDays(anchor: Date): Date[] {
  const dow = anchor.getDay();
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

export default function Calendar({ rowSpan = 2 }: { rowSpan?: number }) {
  const today = useMemo(() => new Date(), []);

  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [weekAnchor, setWeekAnchor] = useState<Date>(today);
  const [view, setView] = useState<"week" | "day">("week");
  const [focusedDay, setFocusedDay] = useState<Date | null>(null);
  const [dayTarget, setDayTarget] = useState<Date>(today);

  const monthGrid = useMemo(() => getMonthGrid(displayYear, displayMonth), [displayYear, displayMonth]);
  const weekDays = useMemo(() => getWeekDays(weekAnchor), [weekAnchor]);

  function shiftMonth(delta: -1 | 1) {
    setDisplayMonth((m) => {
      const next = m + delta;
      if (next < 0) {
        setDisplayYear((y) => y - 1);
        return 11;
      }
      if (next > 11) {
        setDisplayYear((y) => y + 1);
        return 0;
      }
      return next;
    });
  }

  function handleMonthDayClick(day: number) {
    const clicked = new Date(displayYear, displayMonth, day);
    if (view === "week" && focusedDay && isSameDay(focusedDay, clicked)) {
      setDayTarget(clicked);
      setView("day");
    } else {
      setFocusedDay(clicked);
      setWeekAnchor(clicked);
      setView("week");
    }
  }

  function handleWeekDayClick(day: Date) {
    // auto-advance month if day belongs to a different month
    if (day.getMonth() !== displayMonth || day.getFullYear() !== displayYear) {
      setDisplayYear(day.getFullYear());
      setDisplayMonth(day.getMonth());
    }
    setDayTarget(day);
    setView("day");
  }

  return (
    <div
      style={{ gridColumn: "1 / -1", gridRow: `-${rowSpan + 1} / -1` }}
      className="flex border-t border-zinc-200 overflow-hidden"
    >
      {/* Month view */}
      <div className="shrink-0 flex flex-col border-r border-zinc-200 px-4 py-2 gap-1.5 text-[10px]">
        <div className="flex items-center gap-1 h-4">
          <button
            onClick={() => shiftMonth(-1)}
            className="w-4 text-zinc-400 hover:text-zinc-900 leading-none cursor-pointer"
          >
            ‹
          </button>
          <div className="uppercase tracking-widest text-zinc-400 flex-1 text-center">
            {MONTHS[displayMonth]} {displayYear}
          </div>
          <button
            onClick={() => shiftMonth(1)}
            className="w-4 text-zinc-400 hover:text-zinc-900 leading-none cursor-pointer"
          >
            ›
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
              <div
                key={wi}
                className={`flex gap-x-1.5 rounded ${
                  isSelectedWeek ? "bg-zinc-100" : isDayWeek ? "bg-zinc-200" : ""
                }`}
              >
                {week.map((day, di) => {
                  const isToday = day === today.getDate() && displayMonth === today.getMonth() && displayYear === today.getFullYear();
                  return (
                    <div
                      key={di}
                      onClick={day ? () => handleMonthDayClick(day) : undefined}
                      className={`text-center w-5 ${day ? "cursor-pointer" : ""} ${
                        (isSelectedWeek || isDayWeek) && day
                          ? "text-zinc-900"
                          : day
                            ? "text-zinc-500 hover:text-zinc-900"
                            : ""
                      } ${isToday ? "text-zinc-900 underline" : ""}`}
                    >
                      {day ?? ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Week view */}
      {view === "week" && (
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, today);
            return (
              <div
                key={i}
                onClick={() => handleWeekDayClick(day)}
                className={`flex flex-col border-r border-zinc-200 last:border-r-0 px-3 py-2 cursor-pointer ${
                  isToday ? "bg-zinc-50" : "hover:bg-zinc-50"
                }`}
              >
                <div className="uppercase tracking-widest text-zinc-400">{DAYS_SHORT[i]}</div>
                <div
                  className={`text-xs mt-1 ${isToday ? "text-zinc-900 underline" : "text-zinc-500"}`}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day view */}
      {view === "day" && (
        <div className="flex-1 flex flex-col px-4 py-2">
          <div className=" uppercase tracking-widest text-zinc-400 mb-1">{DAYS_SHORT[(dayTarget.getDay() + 6) % 7]}</div>
          <div className="text-xs text-zinc-900 underline">
            {dayTarget.getDate()} {MONTHS[dayTarget.getMonth()]} {dayTarget.getFullYear()}
          </div>
        </div>
      )}
    </div>
  );
}
