import { CalendarEvent, UserCalendar } from "@/features/calendar/types";
import { Tables } from "./database.types";
import { createClient } from "./server";

type RawEvent = Tables<"calendar_events">;
type RawCalendar = Tables<"calendars"> & { calendar_events: RawEvent[] };
type RawMembership = Tables<"calendar_members"> & { calendars: RawCalendar };
type RawInstance = Tables<"event_instances"> & { calendar_events: RawEvent };

function mapEvent(e: RawEvent, instanceId?: string, displayName?: string | null, originalEventId?: string): CalendarEvent {
  return {
    id: e.id,
    calendarId: e.calendar_id,
    title: e.title,
    date: e.date,
    start: e.start_time.slice(0, 5),
    end: e.end_time.slice(0, 5),
    ...(instanceId && { instanceId, originalEventId, displayName: displayName ?? undefined }),
  };
}

export async function fetchCalendars(): Promise<UserCalendar[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const [{ data: ownedRaw }, { data: membershipsRaw }, { data: instancesRaw }] = await Promise.all([
    supabase
      .from("calendars")
      .select(
        "id, name, color, created_at, user_id, calendar_events(id, calendar_id, title, date, start_time, end_time, created_at, user_id)",
      )
      .eq("user_id", user.id)
      .order("created_at"),
    supabase
      .from("calendar_members")
      .select(
        "*, calendars(id, name, color, created_at, user_id, calendar_events(id, calendar_id, title, date, start_time, end_time, created_at, user_id))",
      )
      .eq("user_id", user.id)
      .eq("status", "accepted"),
    supabase
      .from("event_instances")
      .select("*, calendar_events(id, calendar_id, title, date, start_time, end_time, created_at, user_id)")
      .eq("user_id", user.id),
  ]);

  const owned = (ownedRaw ?? []) as RawCalendar[];
  const memberships = (membershipsRaw ?? []) as RawMembership[];
  const instances = (instancesRaw ?? []) as RawInstance[];

  function instancesForCalendar(calendarId: string): CalendarEvent[] {
    return instances
      .filter((i) => i.calendar_events?.calendar_id === calendarId)
      .map((i) => mapEvent(i.calendar_events, i.id, i.display_name, i.event_id));
  }

  const result: UserCalendar[] = [];

  for (const cal of owned) {
    result.push({
      id: cal.id,
      name: cal.name,
      color: cal.color,
      role: "author",
      events: [...(cal.calendar_events ?? []).map((e) => mapEvent(e)), ...instancesForCalendar(cal.id)],
    });
  }

  for (const m of memberships) {
    const cal = m.calendars;
    if (!cal) continue;
    result.push({
      id: cal.id,
      name: cal.name,
      color: cal.color,
      role: m.role,
      events: [...(cal.calendar_events ?? []).map((e) => mapEvent(e)), ...instancesForCalendar(cal.id)],
    });
  }

  return result;
}
