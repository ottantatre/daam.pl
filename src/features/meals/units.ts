// Canonical list of measurement units. Free-text input is not allowed.
// Base unit for product macros is always grams (g).
//
// Conversion rules:
//   g, kg            — universal mass conversions (1, 1000)
//   ml, l            — per-product (depends on density)
//   szt              — per-product (1 piece = X grams; e.g. egg 50g)
//   łyżka/łyżeczka/szklanka/garść/kromka/plaster/opakowanie — per-product
//
// A unit is "available" on a product when:
//   - it's g or kg (always), OR
//   - the product has it defined in unit_conversions jsonb

export const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "szt",
  "łyżka",
  "łyżeczka",
  "szklanka",
  "garść",
  "kromka",
  "plaster",
  "opakowanie",
] as const;

export type Unit = (typeof UNITS)[number];

export const UNIVERSAL_UNITS: Unit[] = ["g", "kg"];

export type UnitConversions = Record<string, number>;

// Returns grams equivalent for `quantity` of `unit`, using the product's conversion table.
// Returns null if the conversion is impossible (no entry for non-universal unit).
export function toGrams(quantity: number, unit: Unit, conversions: UnitConversions): number | null {
  if (unit === "g") return quantity;
  if (unit === "kg") return quantity * 1000;
  const factor = conversions[unit];
  if (factor === undefined || factor === null) return null;
  return quantity * factor;
}

// Units that the user can choose when adding this product to a recipe.
export function availableUnits(conversions: UnitConversions): Unit[] {
  const fromConversions = (Object.keys(conversions ?? {}) as Unit[]).filter((u) =>
    UNITS.includes(u as Unit),
  );
  return [...UNIVERSAL_UNITS, ...fromConversions];
}
