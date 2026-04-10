import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ calendarId: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { calendarId } = await params;
  const { title, date, start, end } = await request.json();

  const { data, error } = await supabase
    .from("calendar_events")
    .insert({ calendar_id: calendarId, user_id: user.id, title, date, start_time: start, end_time: end })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
