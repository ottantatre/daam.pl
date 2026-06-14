-- Zmiana FK: usunięcie produktu cascade usuwa odwołania w recipe_ingredients.
-- Wcześniej było RESTRICT, co blokowało usunięcie produktu używanego w przepisie.
-- Teraz: przepis traci ten składnik, ale reszta zostaje. UI ostrzeże user'a ile przepisów dotkniętych.

alter table recipe_ingredients drop constraint recipe_ingredients_product_id_fkey;
alter table recipe_ingredients
  add constraint recipe_ingredients_product_id_fkey
  foreign key (product_id) references products(id) on delete cascade;
