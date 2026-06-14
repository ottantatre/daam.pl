import { MealPlanEntry, Product, Recipe, ShoppingCheck } from "./types";
import { Unit, toGrams, UNIVERSAL_UNITS } from "./units";

export type ShoppingScope = "user" | "household";

export type ShoppingItem = {
  productId: string;
  productName: string;
  unit: Unit;
  totalNeeded: number;
  checkedQty: number;
  remaining: number;
  covered: boolean;
};

function itemKey(productId: string, unit: Unit): string {
  return `${productId}|${unit}`;
}

export { itemKey as shoppingItemKey };

// Choose a display unit for aggregated ingredient list.
// Aggregation is done in grams (canonical), but for display we want the unit
// the user usually shops in. Strategy: pick the most common unit used in the
// contributing ingredient rows. Universal units g/kg fall back to grams.
function pickDisplayUnit(units: Unit[]): Unit {
  const counts = new Map<Unit, number>();
  for (const u of units) counts.set(u, (counts.get(u) ?? 0) + 1);
  let best: Unit = "g";
  let bestCount = -1;
  for (const [u, c] of counts) {
    if (c > bestCount) {
      best = u;
      bestCount = c;
    }
  }
  return best;
}

function displayQty(grams: number, unit: Unit, conversions: Record<string, number>): number {
  if (unit === "g") return grams;
  if (unit === "kg") return grams / 1000;
  const factor = conversions[unit];
  if (!factor || factor <= 0) return grams;
  return grams / factor;
}

export function computeShoppingList(
  plans: MealPlanEntry[],
  recipes: Recipe[],
  products: Product[],
  checks: ShoppingCheck[],
  scope: ShoppingScope,
  currentUserId: string | null,
): ShoppingItem[] {
  const recipesById = new Map(recipes.map((r) => [r.id, r]));
  const productsById = new Map(products.map((p) => [p.id, p]));

  const scopedPlans = scope === "user" ? plans.filter((p) => p.userId === currentUserId) : plans;

  // Aggregate per product in grams, plus track which units were used for display preference
  type Agg = { product: Product; totalGrams: number; unitsUsed: Unit[] };
  const aggMap = new Map<string, Agg>();

  for (const plan of scopedPlans) {
    const recipe = recipesById.get(plan.recipeId);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      const product = productsById.get(ing.productId);
      if (!product) continue;
      const grams = toGrams(ing.quantity * plan.servingsMultiplier, ing.unit, product.unitConversions);
      if (grams === null) continue;
      const existing = aggMap.get(product.id);
      if (existing) {
        existing.totalGrams += grams;
        existing.unitsUsed.push(ing.unit);
      } else {
        aggMap.set(product.id, { product, totalGrams: grams, unitsUsed: [ing.unit] });
      }
    }
  }

  // Index checks by (product_id, unit) limited to current scope
  const checkLookup = new Map<string, ShoppingCheck>();
  for (const c of checks) {
    if (c.scope !== scope) continue;
    checkLookup.set(itemKey(c.productId, c.unit), c);
  }

  const items: ShoppingItem[] = [];
  for (const agg of aggMap.values()) {
    const displayUnit = pickDisplayUnit(agg.unitsUsed);
    const totalNeeded = displayQty(agg.totalGrams, displayUnit, agg.product.unitConversions);

    // Match check by (product, displayUnit). If user checked in a different unit, treat as separate.
    const check = checkLookup.get(itemKey(agg.product.id, displayUnit));
    const checkedQty = check?.quantityAtCheck ?? 0;
    const remaining = Math.max(0, totalNeeded - checkedQty);

    items.push({
      productId: agg.product.id,
      productName: agg.product.name,
      unit: displayUnit,
      totalNeeded,
      checkedQty,
      remaining,
      covered: checkedQty > 0 && remaining === 0,
    });
  }

  items.sort((a, b) => {
    if (a.covered !== b.covered) return a.covered ? 1 : -1;
    return a.productName.localeCompare(b.productName, "pl");
  });

  return items;
}

export function formatQty(q: number): string {
  if (q === Math.floor(q)) return String(q);
  return q.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
