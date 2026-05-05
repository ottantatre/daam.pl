import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export async function POST(request: Request, { params }: { params: Promise<{ calendarId: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { calendarId } = await params;
  const { title, date, start, end } = await request.json();

  const trimmedTitle = typeof title === "string" ? title.trim() : "";
  if (!trimmedTitle) return NextResponse.json({ error: "Title required" }, { status: 400 });
  if (typeof date !== "string" || !DATE_RE.test(date)) return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  if (typeof start !== "string" || !TIME_RE.test(start)) return NextResponse.json({ error: "Invalid start" }, { status: 400 });
  if (typeof end !== "string" || !TIME_RE.test(end)) return NextResponse.json({ error: "Invalid end" }, { status: 400 });
  if (end <= start) return NextResponse.json({ error: "End must be after start" }, { status: 400 });

  const [y, m, d] = date.split("-").map(Number);
  const [sh, sm] = start.split(":").map(Number);
  const startAt = new Date(y, m - 1, d, sh, sm, 0, 0);
  if (startAt.getTime() < Date.now()) return NextResponse.json({ error: "Cannot create events in the past" }, { status: 400 });

  const { data, error } = await supabase
    .from("calendar_events")
    .insert({ calendar_id: calendarId, user_id: user.id, title: trimmedTitle, date, start_time: start, end_time: end })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
