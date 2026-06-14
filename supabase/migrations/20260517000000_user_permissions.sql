-- Per-user view/feature permissions. Keys are free strings: "view:dashboard", "view:meals" etc.
-- Designed flat (no roles) for simplicity. Add role layer later if needed.
create table user_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  permission text not null,
  granted_at timestamptz default now(),
  unique (user_id, permission)
);

alter table user_permissions enable row level security;

-- User can read their own permissions. No insert/update/delete via RLS — grants done by admin via Supabase dashboard.
create policy "own permissions read" on user_permissions for select using (auth.uid() = user_id);

create index user_permissions_user_idx on user_permissions (user_id);

-- Seed primary user with all current view permissions (idempotent).
insert into user_permissions (user_id, permission)
select u.id, p.perm
from auth.users u
cross join (values ('view:dashboard'), ('view:meals')) as p(perm)
where u.email = 'mateusz.boroch@gmail.com'
on conflict (user_id, permission) do nothing;
