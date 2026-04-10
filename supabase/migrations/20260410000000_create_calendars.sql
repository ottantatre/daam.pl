create table calendars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  color text not null default '#3b82f6',
  created_at timestamptz default now()
);

create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid references calendars on delete cascade not null,
  user_id uuid references auth.users not null,
  title text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now()
);

alter table calendars enable row level security;
alter table calendar_events enable row level security;

create policy "own calendars" on calendars for all using (auth.uid() = user_id);
create policy "own events" on calendar_events for all using (auth.uid() = user_id);
