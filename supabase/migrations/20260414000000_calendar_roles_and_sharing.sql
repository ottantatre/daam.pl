create type calendar_role as enum ('author', 'admin', 'editor', 'creator', 'viewer');
create type invite_status as enum ('pending', 'accepted', 'declined');

-- Membership in shared calendars
create table calendar_members (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid references calendars on delete cascade not null,
  user_id uuid references auth.users not null,
  role calendar_role not null,
  invited_by uuid references auth.users not null,
  status invite_status not null default 'pending',
  created_at timestamptz default now(),
  unique (calendar_id, user_id)
);

-- Event shares (invitations to a single event)
create table event_shares (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references calendar_events on delete cascade not null,
  shared_by uuid references auth.users not null,
  shared_with uuid references auth.users not null,
  role calendar_role not null check (role <> 'author'),
  status invite_status not null default 'pending',
  created_at timestamptz default now(),
  unique (event_id, shared_with)
);

-- Event instances: accepted share linked to recipient's calendar
create table event_instances (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references calendar_events on delete cascade not null,
  calendar_id uuid references calendars on delete cascade not null,
  user_id uuid references auth.users not null,
  display_name text,
  created_at timestamptz default now(),
  unique (event_id, user_id)
);

-- Change proposals from viewers
create table event_change_proposals (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references calendar_events on delete cascade not null,
  proposed_by uuid references auth.users not null,
  title text,
  date date,
  start_time time,
  end_time time,
  status invite_status not null default 'pending',
  created_at timestamptz default now()
);

-- RLS
alter table calendar_members enable row level security;
alter table event_shares enable row level security;
alter table event_instances enable row level security;
alter table event_change_proposals enable row level security;

-- calendar_members: visible to calendar owner and the member themselves
create policy "calendar_members_select" on calendar_members for select
  using (
    auth.uid() = user_id
    or auth.uid() in (select user_id from calendars where id = calendar_id)
  );

create policy "calendar_members_insert" on calendar_members for insert
  with check (
    auth.uid() in (select user_id from calendars where id = calendar_id)
  );

create policy "calendar_members_update" on calendar_members for update
  using (
    auth.uid() in (select user_id from calendars where id = calendar_id)
  );

create policy "calendar_members_delete" on calendar_members for delete
  using (
    auth.uid() in (select user_id from calendars where id = calendar_id)
  );

-- event_shares: visible to sharer and recipient
create policy "event_shares_select" on event_shares for select
  using (auth.uid() = shared_by or auth.uid() = shared_with);

create policy "event_shares_insert" on event_shares for insert
  with check (auth.uid() = shared_by);

create policy "event_shares_update" on event_shares for update
  using (auth.uid() = shared_with); -- only recipient can accept/decline

create policy "event_shares_delete" on event_shares for delete
  using (auth.uid() = shared_by);

-- event_instances: only the instance owner
create policy "event_instances_select" on event_instances for select
  using (auth.uid() = user_id);

create policy "event_instances_insert" on event_instances for insert
  with check (auth.uid() = user_id);

create policy "event_instances_delete" on event_instances for delete
  using (auth.uid() = user_id);

-- event_change_proposals: visible to proposer and original event owner
create policy "event_change_proposals_select" on event_change_proposals for select
  using (
    auth.uid() = proposed_by
    or auth.uid() in (select user_id from calendar_events where id = event_id)
  );

create policy "event_change_proposals_insert" on event_change_proposals for insert
  with check (auth.uid() = proposed_by);

create policy "event_change_proposals_update" on event_change_proposals for update
  using (
    auth.uid() in (select user_id from calendar_events where id = event_id)
  ); -- only event owner can accept/decline

create policy "event_change_proposals_delete" on event_change_proposals for delete
  using (auth.uid() = proposed_by);
