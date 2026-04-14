import { Enums } from "@/lib/supabase/database.types";

export type CalendarRole = Enums<"calendar_role">;
export type InviteStatus = Enums<"invite_status">;

export type CalendarEvent = {
  id: string;
  calendarId: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  // set when this event appears via an instance (shared event)
  instanceId?: string;
  originalEventId?: string;
  displayName?: string; // recipient's local override of title
};

export type UserCalendar = {
  id: string;
  name: string;
  color: string; // hex
  role: CalendarRole; // current user's role in this calendar
  events: CalendarEvent[];
};

export type CalendarMember = {
  id: string;
  calendarId: string;
  userId: string;
  role: CalendarRole;
  invitedBy: string;
  status: InviteStatus;
};

export type EventShare = {
  id: string;
  eventId: string;
  sharedBy: string;
  sharedWith: string;
  role: Exclude<CalendarRole, 'author'>;
  status: InviteStatus;
};

export type EventInstance = {
  id: string;
  eventId: string;
  calendarId: string;
  userId: string;
  displayName?: string;
};

export type EventChangeProposal = {
  id: string;
  eventId: string;
  proposedBy: string;
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status: InviteStatus;
};

// Permission helpers
const CAN_EDIT: CalendarRole[] = ['author', 'admin', 'editor'];
const CAN_DELETE: CalendarRole[] = ['author', 'admin'];
const CAN_ADD: CalendarRole[] = ['author', 'admin', 'editor', 'creator'];

export function canEdit(role: CalendarRole) { return CAN_EDIT.includes(role); }
export function canDelete(role: CalendarRole) { return CAN_DELETE.includes(role); }
export function canAdd(role: CalendarRole) { return CAN_ADD.includes(role); }

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
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
