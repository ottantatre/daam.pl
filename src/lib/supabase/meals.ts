import {
  Household,
  MealPlanEntry,
  MealsData,
  Product,
  ProductCategory,
  Recipe,
  RecipeCategory,
  RecipeIngredient,
  RecipeStep,
  ShoppingCheck,
} from "@/features/meals/types";
import { Unit } from "@/features/meals/units";
import { createClient } from "./server";
import { currentWeek, formatDateISO } from "@/features/meals/mealUtils";

type RawHousehold = { id: string; name: string; created_at: string | null };
type RawCategory = { id: string; name: string; sort_order: number };

type RawProduct = {
  id: string;
  category_id: string | null;
  name: string;
  kcal_per_100g: number | string | null;
  protein_per_100g: number | string | null;
  fat_per_100g: number | string | null;
  carbs_per_100g: number | string | null;
  unit_conversions: Record<string, number> | null;
  notes: string | null;
};

type RawIngredient = {
  id: string;
  product_id: string;
  quantity: number | string;
  unit: string;
  sort_order: number;
};

type RawStep = { id: string; order_index: number; content: string };

type RawRecipe = {
  id: string;
  category_id: string | null;
  name: string;
  servings: number | string;
  notes: string | null;
  recipe_ingredients: RawIngredient[];
  recipe_steps: RawStep[];
};

type RawPlan = {
  id: string;
  user_id: string;
  date: string;
  recipe_id: string;
  servings_multiplier: number | string;
  position: number;
};

type RawCheck = {
  id: string;
  scope: string;
  product_id: string;
  unit: string;
  quantity_at_check: number | string;
  checked_at: string | null;
};

const num = (v: number | string | null | undefined): number =>
  v === null || v === undefined ? 0 : typeof v === "string" ? Number(v) : v;
const numNull = (v: number | string | null | undefined): number | null =>
  v === null || v === undefined ? null : num(v);

function mapHousehold(r: RawHousehold): Household {
  return { id: r.id, name: r.name, createdAt: r.created_at ?? "" };
}

function mapCategory(r: RawCategory): ProductCategory {
  return { id: r.id, name: r.name, sortOrder: r.sort_order };
}

function mapProduct(r: RawProduct): Product {
  return {
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    kcalPer100g: numNull(r.kcal_per_100g),
    proteinPer100g: numNull(r.protein_per_100g),
    fatPer100g: numNull(r.fat_per_100g),
    carbsPer100g: numNull(r.carbs_per_100g),
    unitConversions: r.unit_conversions ?? {},
    notes: r.notes,
  };
}

function mapIngredient(r: RawIngredient): RecipeIngredient {
  return {
    id: r.id,
    productId: r.product_id,
    quantity: num(r.quantity),
    unit: r.unit as Unit,
    sortOrder: r.sort_order,
  };
}

function mapStep(r: RawStep): RecipeStep {
  return { id: r.id, orderIndex: r.order_index, content: r.content };
}

function mapRecipe(r: RawRecipe): Recipe {
  return {
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    servings: num(r.servings),
    notes: r.notes,
    ingredients: (r.recipe_ingredients ?? []).sort((a, b) => a.sort_order - b.sort_order).map(mapIngredient),
    steps: (r.recipe_steps ?? []).sort((a, b) => a.order_index - b.order_index).map(mapStep),
  };
}

function mapPlan(r: RawPlan): MealPlanEntry {
  return {
    id: r.id,
    userId: r.user_id,
    date: r.date,
    recipeId: r.recipe_id,
    servingsMultiplier: num(r.servings_multiplier),
    position: r.position,
  };
}

function mapCheck(r: RawCheck): ShoppingCheck {
  return {
    id: r.id,
    scope: r.scope as "user" | "household",
    productId: r.product_id,
    unit: r.unit as Unit,
    quantityAtCheck: num(r.quantity_at_check),
    checkedAt: r.checked_at ?? "",
  };
}

const EMPTY_DATA: MealsData = {
  household: null,
  productCategories: [],
  products: [],
  recipeCategories: [],
  recipes: [],
  plans: [],
  checks: [],
};

export async function fetchMealsData(): Promise<MealsData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return EMPTY_DATA;

  const membership = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership.data) return EMPTY_DATA;

  const days = currentWeek();
  const startISO = formatDateISO(days[0]);
  const endISO = formatDateISO(days[days.length - 1]);

  const [
    householdRes,
    productCategoriesRes,
    productsRes,
    recipeCategoriesRes,
    recipesRes,
    plansRes,
    checksRes,
  ] = await Promise.all([
    supabase.from("households").select("id, name, created_at").eq("id", membership.data.household_id).single(),
    supabase.from("product_categories").select("id, name, sort_order").order("sort_order"),
    supabase
      .from("products")
      .select(
        "id, category_id, name, kcal_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g, unit_conversions, notes",
      )
      .order("name"),
    supabase.from("recipe_categories").select("id, name, sort_order").order("sort_order"),
    supabase
      .from("recipes")
      .select("id, category_id, name, servings, notes, recipe_ingredients(*), recipe_steps(*)")
      .order("name"),
    supabase
      .from("meal_plans")
      .select("id, user_id, date, recipe_id, servings_multiplier, position")
      .gte("date", startISO)
      .lte("date", endISO)
      .order("date")
      .order("position"),
    supabase
      .from("shopping_checks")
      .select("id, scope, product_id, unit, quantity_at_check, checked_at"),
  ]);

  return {
    household: householdRes.data ? mapHousehold(householdRes.data as RawHousehold) : null,
    productCategories: ((productCategoriesRes.data ?? []) as RawCategory[]).map(mapCategory),
    products: ((productsRes.data ?? []) as RawProduct[]).map(mapProduct),
    recipeCategories: ((recipeCategoriesRes.data ?? []) as RawCategory[]).map(mapCategory),
    recipes: ((recipesRes.data ?? []) as RawRecipe[]).map(mapRecipe),
    plans: ((plansRes.data ?? []) as RawPlan[]).map(mapPlan),
    checks: ((checksRes.data ?? []) as RawCheck[]).map(mapCheck),
  };
}
