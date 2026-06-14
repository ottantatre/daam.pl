import { Product, Recipe, RecipeIngredient } from "./types";
import { toGrams } from "./units";

export type Macros = {
  kcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
};

export const ZERO_MACROS: Macros = { kcal: 0, proteinG: 0, fatG: 0, carbsG: 0 };

// Macros contribution of one ingredient (entire qty, not per serving).
export function ingredientMacros(ing: RecipeIngredient, product: Product | undefined): Macros {
  if (!product) return ZERO_MACROS;
  const grams = toGrams(ing.quantity, ing.unit, product.unitConversions);
  if (grams === null) return ZERO_MACROS;
  const factor = grams / 100;
  return {
    kcal: (product.kcalPer100g ?? 0) * factor,
    proteinG: (product.proteinPer100g ?? 0) * factor,
    fatG: (product.fatPer100g ?? 0) * factor,
    carbsG: (product.carbsPer100g ?? 0) * factor,
  };
}

export function sumMacros(a: Macros, b: Macros): Macros {
  return {
    kcal: a.kcal + b.kcal,
    proteinG: a.proteinG + b.proteinG,
    fatG: a.fatG + b.fatG,
    carbsG: a.carbsG + b.carbsG,
  };
}

// Macros for the WHOLE recipe (all ingredients summed).
export function recipeMacros(recipe: Recipe, productsById: Map<string, Product>): Macros {
  return recipe.ingredients.reduce(
    (acc, ing) => sumMacros(acc, ingredientMacros(ing, productsById.get(ing.productId))),
    ZERO_MACROS,
  );
}

// Macros for one serving of the recipe.
export function recipePerServingMacros(recipe: Recipe, productsById: Map<string, Product>): Macros {
  const total = recipeMacros(recipe, productsById);
  const servings = recipe.servings > 0 ? recipe.servings : 1;
  return {
    kcal: total.kcal / servings,
    proteinG: total.proteinG / servings,
    fatG: total.fatG / servings,
    carbsG: total.carbsG / servings,
  };
}
