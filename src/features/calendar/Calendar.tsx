"use client";

import { useMemo, useState } from "react";
import { getMonthGrid, getWeekDays, isSameDay } from "./calendarUtils";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import { UserCalendar } from "./types";

export default function Calendar({ rowSpan = 2, calendars = [] }: { rowSpan?: number; calendars?: UserCalendar[] }) {
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
    if (day.getMonth() !== displayMonth || day.getFullYear() !== displayYear) {
      setDisplayYear(day.getFullYear());
      setDisplayMonth(day.getMonth());
    }
    setDayTarget(day);
    setView("day");
  }

  return (
    <div style={{ gridColumn: "1 / -1", gridRow: `-${rowSpan + 1} / -1` }} className="flex overflow-hidden">
      <MonthView
        displayYear={displayYear}
        displayMonth={displayMonth}
        monthGrid={monthGrid}
        today={today}
        view={view}
        focusedDay={focusedDay}
        dayTarget={dayTarget}
        onShiftMonth={shiftMonth}
        onDayClick={handleMonthDayClick}
      />

      {view === "week" && <WeekView weekDays={weekDays} onDayClick={handleWeekDayClick} />}

      {view === "day" && <DayView dayTarget={dayTarget} calendars={calendars} />}
    </div>
  );
}
