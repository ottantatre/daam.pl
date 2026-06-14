-- Seed: ~50 podstawowych produktów spożywczych dla aktywnego householdu.
-- Uruchom w Supabase SQL Editor (postgres role bypasses RLS).
-- Zakłada że masz już household + jesteś jego członkiem.
-- Wartości makro przybliżone (źródło: USDA + IŻŻ).
-- Przeliczniki jednostek: grams per 1 unit. g/kg są wbudowane (×1, ×1000) — nie ma sensu ich tu podawać.

do $$
declare
  hh_id uuid;
  c_nabial uuid;
  c_mieso uuid;
  c_zboza uuid;
  c_warzywa uuid;
  c_owoce uuid;
  c_strakowe uuid;
  c_orzechy uuid;
  c_tluszcze uuid;
  c_slodkie uuid;
  c_przyprawy uuid;
  c_napoje uuid;
begin
  -- Znajdź household po user'ze (zmień email jeśli inny)
  select hm.household_id into hh_id
  from household_members hm
  join auth.users u on u.id = hm.user_id
  where u.email = 'mateusz.boroch@gmail.com'
  limit 1;

  if hh_id is null then
    raise exception 'Household nie znaleziony — sprawdź email lub czy jest membership';
  end if;

  -- Kategorie
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Nabiał', 1) returning id into c_nabial;
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Mięso i ryby', 2) returning id into c_mieso;
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Zboża i pieczywo', 3) returning id into c_zboza;
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Warzywa', 4) returning id into c_warzywa;
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Owoce', 5) returning id into c_owoce;
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Strączkowe', 6) returning id into c_strakowe;
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Orzechy i nasiona', 7) returning id into c_orzechy;
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Tłuszcze', 8) returning id into c_tluszcze;
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Słodkie', 9) returning id into c_slodkie;
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Przyprawy', 10) returning id into c_przyprawy;
  insert into product_categories (household_id, name, sort_order) values (hh_id, 'Napoje', 11) returning id into c_napoje;

  -- Produkty
  insert into products (household_id, category_id, name, kcal_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g, unit_conversions) values
    -- Nabiał
    (hh_id, c_nabial, 'Mleko 2%',              50, 3.4,  2.0,  4.8, '{"szklanka": 250, "łyżka": 15, "łyżeczka": 5, "ml": 1, "l": 1000}'::jsonb),
    (hh_id, c_nabial, 'Jogurt naturalny',      61, 3.5,  3.3,  4.7, '{"opakowanie": 150, "szklanka": 250, "łyżka": 15, "łyżeczka": 5}'::jsonb),
    (hh_id, c_nabial, 'Jajko',                155, 13,  11,    1.1, '{"szt": 50}'::jsonb),
    (hh_id, c_nabial, 'Ser żółty',            356, 25,  27,    2.2, '{"plaster": 20}'::jsonb),
    (hh_id, c_nabial, 'Twaróg półtłusty',     133, 17,   5,    3.5, '{"opakowanie": 250}'::jsonb),
    (hh_id, c_nabial, 'Masło',                717, 0.9, 81,    0.1, '{"łyżka": 14, "łyżeczka": 5, "opakowanie": 200}'::jsonb),
    (hh_id, c_nabial, 'Śmietana 18%',         184, 2.6, 18,    3.6, '{"łyżka": 15, "łyżeczka": 5, "szklanka": 250, "opakowanie": 200}'::jsonb),

    -- Mięso i ryby
    (hh_id, c_mieso, 'Filet z kurczaka',      165, 31,   3.6,  0,   '{}'::jsonb),
    (hh_id, c_mieso, 'Mielone wołowe',        250, 26,  17,    0,   '{"opakowanie": 500}'::jsonb),
    (hh_id, c_mieso, 'Schab',                 143, 22,   6,    0,   '{}'::jsonb),
    (hh_id, c_mieso, 'Łosoś',                 208, 20,  13,    0,   '{}'::jsonb),
    (hh_id, c_mieso, 'Tuńczyk w sosie własnym',116,26,   1,    0,   '{"opakowanie": 120}'::jsonb),
    (hh_id, c_mieso, 'Szynka konserwowa',     130, 21,   5,    1,   '{"plaster": 15}'::jsonb),

    -- Zboża i pieczywo
    (hh_id, c_zboza, 'Mąka pszenna',          364, 10,   1,   76,   '{"łyżka": 10, "łyżeczka": 3, "szklanka": 130}'::jsonb),
    (hh_id, c_zboza, 'Chleb pszenny',         265,  9,   3.2, 49,   '{"kromka": 30}'::jsonb),
    (hh_id, c_zboza, 'Chleb żytni',           247,  9,   1.2, 48,   '{"kromka": 35}'::jsonb),
    (hh_id, c_zboza, 'Ryż biały (sucho)',     365,  7,   1,   80,   '{"łyżka": 15, "szklanka": 200}'::jsonb),
    (hh_id, c_zboza, 'Makaron (sucho)',       371, 13,   1.5, 75,   '{"szklanka": 120}'::jsonb),
    (hh_id, c_zboza, 'Kasza gryczana (sucho)',343, 13,   3.4, 72,   '{"łyżka": 15, "szklanka": 175}'::jsonb),
    (hh_id, c_zboza, 'Płatki owsiane',        379, 13,   7,   68,   '{"łyżka": 12, "szklanka": 90}'::jsonb),

    -- Warzywa
    (hh_id, c_warzywa, 'Cebula',               40, 1.1, 0.1,  9.3,  '{"szt": 110}'::jsonb),
    (hh_id, c_warzywa, 'Czosnek',             149, 6.4, 0.5, 33,    '{"szt": 5}'::jsonb),
    (hh_id, c_warzywa, 'Marchew',              41, 0.9, 0.2,  9.6,  '{"szt": 70}'::jsonb),
    (hh_id, c_warzywa, 'Pomidor',              18, 0.9, 0.2,  3.9,  '{"szt": 120}'::jsonb),
    (hh_id, c_warzywa, 'Papryka czerwona',     31, 1,   0.3,  6,    '{"szt": 150}'::jsonb),
    (hh_id, c_warzywa, 'Ogórek',               16, 0.7, 0.1,  3.6,  '{"szt": 200}'::jsonb),
    (hh_id, c_warzywa, 'Sałata',               15, 1.4, 0.2,  2.9,  '{"szt": 250}'::jsonb),
    (hh_id, c_warzywa, 'Brokuł',               34, 2.8, 0.4,  7,    '{"szt": 400}'::jsonb),
    (hh_id, c_warzywa, 'Ziemniak',             77, 2,   0.1, 17,    '{"szt": 150}'::jsonb),
    (hh_id, c_warzywa, 'Pietruszka liście',    36, 3,   0.8,  6,    '{"łyżka": 4, "garść": 30}'::jsonb),
    (hh_id, c_warzywa, 'Szpinak',              23, 2.9, 0.4,  3.6,  '{"garść": 30, "opakowanie": 200}'::jsonb),

    -- Owoce
    (hh_id, c_owoce, 'Jabłko',                 52, 0.3, 0.2, 14,    '{"szt": 180}'::jsonb),
    (hh_id, c_owoce, 'Banan',                  89, 1.1, 0.3, 23,    '{"szt": 120}'::jsonb),
    (hh_id, c_owoce, 'Cytryna',                29, 1.1, 0.3,  9,    '{"szt": 80}'::jsonb),
    (hh_id, c_owoce, 'Pomarańcza',             47, 0.9, 0.1, 12,    '{"szt": 200}'::jsonb),
    (hh_id, c_owoce, 'Jagody',                 57, 0.7, 0.3, 14,    '{"garść": 30, "szklanka": 150}'::jsonb),
    (hh_id, c_owoce, 'Truskawki',              32, 0.7, 0.3,  7.7,  '{"garść": 50, "szklanka": 200}'::jsonb),

    -- Strączkowe
    (hh_id, c_strakowe, 'Soczewica czerwona (sucho)', 353, 25, 1,  60, '{"łyżka": 12, "szklanka": 200}'::jsonb),
    (hh_id, c_strakowe, 'Fasola czerwona (sucho)',   333, 24, 1,  60, '{"łyżka": 15, "szklanka": 180}'::jsonb),
    (hh_id, c_strakowe, 'Ciecierzyca (sucho)',        364, 19, 6,  61, '{"łyżka": 15, "szklanka": 200}'::jsonb),

    -- Orzechy i nasiona
    (hh_id, c_orzechy, 'Migdały',             579, 21,  50,  22,   '{"łyżka": 8, "garść": 30}'::jsonb),
    (hh_id, c_orzechy, 'Orzechy włoskie',     654, 15,  65,  14,   '{"łyżka": 8, "garść": 30}'::jsonb),
    (hh_id, c_orzechy, 'Siemię lniane',       534, 18,  42,  29,   '{"łyżka": 10, "łyżeczka": 3}'::jsonb),
    (hh_id, c_orzechy, 'Słonecznik łuskany',  584, 21,  51,  20,   '{"łyżka": 10, "garść": 30}'::jsonb),

    -- Tłuszcze
    (hh_id, c_tluszcze, 'Oliwa z oliwek',     884,  0, 100,   0,   '{"ml": 0.92, "l": 920, "łyżka": 13, "łyżeczka": 4}'::jsonb),
    (hh_id, c_tluszcze, 'Olej rzepakowy',     884,  0, 100,   0,   '{"ml": 0.92, "l": 920, "łyżka": 13, "łyżeczka": 4}'::jsonb),
    (hh_id, c_tluszcze, 'Masło orzechowe',    588, 25,  50,  20,   '{"łyżka": 16, "łyżeczka": 5, "opakowanie": 350}'::jsonb),

    -- Słodkie
    (hh_id, c_slodkie, 'Cukier biały',        387,  0,   0, 100,   '{"łyżka": 15, "łyżeczka": 5, "szklanka": 200}'::jsonb),
    (hh_id, c_slodkie, 'Miód',                304, 0.3,  0,  82,   '{"łyżka": 20, "łyżeczka": 7}'::jsonb),
    (hh_id, c_slodkie, 'Czekolada gorzka 70%',546, 7.8, 31,  46,   '{"opakowanie": 100}'::jsonb),

    -- Przyprawy
    (hh_id, c_przyprawy, 'Sól',                 0,  0,   0,   0,   '{"łyżka": 18, "łyżeczka": 6}'::jsonb),
    (hh_id, c_przyprawy, 'Pieprz czarny',     251, 10,   3,  64,   '{"łyżeczka": 2}'::jsonb),
    (hh_id, c_przyprawy, 'Papryka słodka mielona',282,14,13,  54,   '{"łyżeczka": 2}'::jsonb),
    (hh_id, c_przyprawy, 'Oregano suszone',   265,  9,   4,  69,   '{"łyżeczka": 1}'::jsonb),
    (hh_id, c_przyprawy, 'Bazylia suszona',   233, 23,   4,  48,   '{"łyżeczka": 1}'::jsonb),

    -- Napoje
    (hh_id, c_napoje, 'Woda',                   0,  0,   0,   0,   '{"ml": 1, "l": 1000, "szklanka": 250, "łyżka": 15, "łyżeczka": 5}'::jsonb);

  raise notice 'Seed: dodano kategorie + produkty dla household %', hh_id;
end $$;
