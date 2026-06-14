import { Unit, UnitConversions } from "./units";

export type Household = {
  id: string;
  name: string;
  createdAt: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  categoryId: string | null;
  name: string;
  kcalPer100g: number | null;
  proteinPer100g: number | null;
  fatPer100g: number | null;
  carbsPer100g: number | null;
  unitConversions: UnitConversions;
  notes: string | null;
};

export type RecipeCategory = {
  id: string;
  name: string;
  sortOrder: number;
};

export type RecipeIngredient = {
  id: string;
  productId: string;
  quantity: number;
  unit: Unit;
  sortOrder: number;
};

export type RecipeStep = {
  id: string;
  orderIndex: number;
  content: string;
};

export type Recipe = {
  id: string;
  categoryId: string | null;
  name: string;
  servings: number;
  notes: string | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};

export type MealPlanEntry = {
  id: string;
  userId: string;
  date: string;
  recipeId: string;
  servingsMultiplier: number;
  position: number;
};

export type ShoppingCheck = {
  id: string;
  scope: "user" | "household";
  productId: string;
  unit: Unit;
  quantityAtCheck: number;
  checkedAt: string;
};

export type MealsData = {
  household: Household | null;
  productCategories: ProductCategory[];
  products: Product[];
  recipeCategories: RecipeCategory[];
  recipes: Recipe[];
  plans: MealPlanEntry[];
  checks: ShoppingCheck[];
};
