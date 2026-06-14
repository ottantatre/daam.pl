-- Meals v2: introduce Products as separate entity with macros + unit conversions.
-- Recipe ingredients now reference products (FK). Recipe macros become computed.
-- Add recipe_steps. Shopping checks keyed by product_id + unit instead of free text.
-- Reset: drop old meals tables (early stage, breaking change OK).

drop table if exists shopping_checks cascade;
drop table if exists meal_plans cascade;
drop table if exists recipe_ingredients cascade;
drop table if exists recipes cascade;
drop table if exists recipe_categories cascade;

-- Product categories (per-household, distinct from recipe categories)
create table product_categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade not null,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- Products catalog. Macros stored per 100g (base unit always grams).
-- unit_conversions: jsonb mapping unit name -> grams per 1 unit
--   { "łyżka": 15, "szt": 50, "ml": 1.0 }
-- Universal units g (=1) and kg (=1000) are implicit, not stored.
create table products (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade not null,
  category_id uuid references product_categories on delete set null,
  name text not null,
  kcal_per_100g numeric(10, 2),
  protein_per_100g numeric(10, 2),
  fat_per_100g numeric(10, 2),
  carbs_per_100g numeric(10, 2),
  unit_conversions jsonb not null default '{}'::jsonb,
  notes text,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz default now()
);

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
  notes text,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz default now()
);

create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes on delete cascade not null,
  product_id uuid references products on delete restrict not null,
  quantity numeric(10, 3) not null,
  unit text not null,
  sort_order integer not null default 0
);

create table recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes on delete cascade not null,
  order_index integer not null default 0,
  content text not null
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

create table shopping_checks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  scope text not null check (scope in ('user', 'household')),
  product_id uuid references products on delete cascade not null,
  unit text not null,
  quantity_at_check numeric(10, 3) not null,
  checked_at timestamptz default now(),
  unique (household_id, user_id, scope, product_id, unit)
);

-- Indexes
create index products_household_idx on products (household_id);
create index recipe_ingredients_recipe_idx on recipe_ingredients (recipe_id);
create index recipe_ingredients_product_idx on recipe_ingredients (product_id);
create index recipe_steps_recipe_idx on recipe_steps (recipe_id, order_index);
create index meal_plans_user_date_idx on meal_plans (user_id, date);
create index meal_plans_household_date_idx on meal_plans (household_id, date);
create index shopping_checks_lookup_idx on shopping_checks (household_id, user_id, scope);

-- RLS
alter table product_categories enable row level security;
alter table products enable row level security;
alter table recipe_categories enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table recipe_steps enable row level security;
alter table meal_plans enable row level security;
alter table shopping_checks enable row level security;

create policy "product_categories all" on product_categories for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy "products all" on products for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy "recipe_categories all" on recipe_categories for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy "recipes all" on recipes for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy "recipe_ingredients all" on recipe_ingredients for all
  using (recipe_id in (select id from recipes where household_id = current_household_id()))
  with check (recipe_id in (select id from recipes where household_id = current_household_id()));

create policy "recipe_steps all" on recipe_steps for all
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
