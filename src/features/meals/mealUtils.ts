import { MealPlanEntry, Product, Recipe } from "./types";
import { Macros, recipePerServingMacros, sumMacros, ZERO_MACROS } from "./macros";

const DAYS_SHORT = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"];

export function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function currentWeek(from: Date = new Date()): Date[] {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  const dow = start.getDay();
  const offsetToMonday = dow === 0 ? -6 : 1 - dow;
  start.setDate(start.getDate() + offsetToMonday);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function dayShortLabel(d: Date): string {
  return DAYS_SHORT[d.getDay()];
}

export function sumMacrosForDay(
  plansForDay: MealPlanEntry[],
  recipesById: Map<string, Recipe>,
  productsById: Map<string, Product>,
): Macros {
  return plansForDay.reduce((acc, plan) => {
    const recipe = recipesById.get(plan.recipeId);
    if (!recipe) return acc;
    const perServing = recipePerServingMacros(recipe, productsById);
    return sumMacros(acc, {
      kcal: perServing.kcal * plan.servingsMultiplier,
      proteinG: perServing.proteinG * plan.servingsMultiplier,
      fatG: perServing.fatG * plan.servingsMultiplier,
      carbsG: perServing.carbsG * plan.servingsMultiplier,
    });
  }, ZERO_MACROS);
}

export function plansByDate(plans: MealPlanEntry[]): Map<string, MealPlanEntry[]> {
  const map = new Map<string, MealPlanEntry[]>();
  for (const p of plans) {
    const arr = map.get(p.date) ?? [];
    arr.push(p);
    map.set(p.date, arr);
  }
  for (const arr of map.values()) arr.sort((a, b) => a.position - b.position);
  return map;
}
