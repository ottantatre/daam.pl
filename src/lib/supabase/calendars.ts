import { UserCalendar } from "@/features/calendar/types";
import { createClient } from "./server";

export async function fetchCalendars(): Promise<UserCalendar[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("calendars")
    .select("id, name, color, calendar_events(id, calendar_id, title, date, start_time, end_time)")
    .eq("user_id", user.id)
    .order("created_at");

  if (!data) return [];

  return data.map((cal) => ({
    id: cal.id,
    name: cal.name,
    color: cal.color,
    events: (cal.calendar_events ?? []).map((e: { id: string; calendar_id: string; title: string; date: string; start_time: string; end_time: string }) => ({
      id: e.id,
      calendarId: e.calendar_id,
      title: e.title,
      date: e.date,
      start: e.start_time.slice(0, 5),
      end: e.end_time.slice(0, 5),
    })),
  }));
}
