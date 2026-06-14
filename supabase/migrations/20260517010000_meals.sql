-- Households: shared container for recipes + shopping. A user belongs to at most one household.
create table households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz default now()
);

create table household_members (
  household_id uuid references households on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  joined_at timestamptz default now(),
  primary key (household_id, user_id)
);

-- Enforce one household per user
create unique index household_members_user_unique on household_members (user_id);

create table recipe_categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade not null,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

create table recipes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade not null,
  category_id uuid references recipe_categories on delete set null,
  name text not null,
  servings numeric(8, 2) not null default 1,
  kcal numeric(10, 2),
  protein_g numeric(10, 2),
  fat_g numeric(10, 2),
  carbs_g numeric(10, 2),
  notes text,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz default now()
);

create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes on delete cascade not null,
  name text not null,
  quantity numeric(10, 3) not null,
  unit text not null default 'g',
  sort_order integer not null default 0
);

create table meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  household_id uuid references households on delete cascade not null,
  date date not null,
  recipe_id uuid references recipes on delete cascade not null,
  servings_multiplier numeric(8, 2) not null default 1,
  position integer not null default 0,
  created_at timestamptz default now()
);

create index meal_plans_user_date_idx on meal_plans (user_id, date);
create index meal_plans_household_date_idx on meal_plans (household_id, date);

create table shopping_checks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  scope text not null check (scope in ('user', 'household')),
  ingredient_name text not null,
  unit text not null,
  quantity_at_check numeric(10, 3) not null,
  checked_at timestamptz default now(),
  unique (household_id, user_id, scope, ingredient_name, unit)
);

create index shopping_checks_lookup_idx on shopping_checks (household_id, user_id, scope);

-- Helper to avoid recursive RLS on household_members
create or replace function current_household_id() returns uuid
  language sql security definer stable
  as $$
    select household_id from household_members where user_id = auth.uid() limit 1
  $$;
revoke all on function current_household_id() from public;
grant execute on function current_household_id() to authenticated;

-- RLS
alter table households enable row level security;
alter table household_members enable row level security;
alter table recipe_categories enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table meal_plans enable row level security;
alter table shopping_checks enable row level security;

create policy "households read" on households for select
  using (id = current_household_id());
create policy "households insert" on households for insert
  with check (created_by = auth.uid());
create policy "households update" on households for update
  using (id = current_household_id());

create policy "household_members read" on household_members for select
  using (user_id = auth.uid() or household_id = current_household_id());
create policy "household_members self insert" on household_members for insert
  with check (user_id = auth.uid());
create policy "household_members self delete" on household_members for delete
  using (user_id = auth.uid());

create policy "recipe_categories read" on recipe_categories for select
  using (household_id = current_household_id());
create policy "recipe_categories write" on recipe_categories for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy "recipes read" on recipes for select
  using (household_id = current_household_id());
create policy "recipes write" on recipes for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy "recipe_ingredients read" on recipe_ingredients for select
  using (recipe_id in (select id from recipes where household_id = current_household_id()));
create policy "recipe_ingredients write" on recipe_ingredients for all
  using (recipe_id in (select id from recipes where household_id = current_household_id()))
  with check (recipe_id in (select id from recipes where household_id = current_household_id()));

create policy "meal_plans read" on meal_plans for select
  using (household_id = current_household_id());
create policy "meal_plans own write" on meal_plans for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and household_id = current_household_id());

create policy "shopping_checks read" on shopping_checks for select
  using (
    (scope = 'user' and user_id = auth.uid())
    or (scope = 'household' and household_id = current_household_id())
  );
create policy "shopping_checks write" on shopping_checks for all
  using (
    (scope = 'user' and user_id = auth.uid())
    or (scope = 'household' and household_id = current_household_id())
  )
  with check (
    (scope = 'user' and user_id = auth.uid())
    or (scope = 'household' and household_id = current_household_id())
  );
