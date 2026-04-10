export type CalendarEvent = {
  id: string;
  calendarId: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  start: string; // "HH:MM"
  end: string; // "HH:MM"
};

export type UserCalendar = {
  id: string;
  name: string;
  color: string; // hex
  events: CalendarEvent[];
};

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function eventPosition(start: string, end: string): { left: string; width: string } {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  return {
    left: `${(startMin / 1440) * 100}%`,
    width: `${((endMin - startMin) / 1440) * 100}%`,
  };
}
