"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { MealPlanEntry, Product, Recipe, ShoppingCheck } from "./types";
import { Unit } from "./units";
import {
  ShoppingScope,
  ShoppingItem,
  computeShoppingList,
  formatQty,
  shoppingItemKey,
} from "./shoppingUtils";

interface Props {
  householdId: string;
  plans: MealPlanEntry[];
  recipes: Recipe[];
  products: Product[];
  checks: ShoppingCheck[];
  currentUserId: string | null;
}

const SYNC_DEBOUNCE_MS = 500;

export function ShoppingListPanel({ householdId, plans, recipes, products, checks, currentUserId }: Props) {
  const [mode, setMode] = useState<ShoppingScope>("user");

  const [localChecks, setLocalChecks] = useState<ShoppingCheck[]>(checks);
  const localChecksRef = useRef(localChecks);
  useEffect(() => {
    localChecksRef.current = localChecks;
  }, [localChecks]);

  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const t of timers.values()) clearTimeout(t);
      timers.clear();
    };
  }, []);

  const items = useMemo(
    () => computeShoppingList(plans, recipes, products, localChecks, mode, currentUserId),
    [plans, recipes, products, localChecks, mode, currentUserId],
  );

  const scheduleSync = (productId: string, unit: Unit) => {
    const key = shoppingItemKey(productId, unit);
    const existing = timersRef.current.get(key);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(async () => {
      timersRef.current.delete(key);
      if (!currentUserId) return;
      const latest = localChecksRef.current.find(
        (c) => c.productId === productId && c.unit === unit && c.scope === mode,
      );
      const supabase = createClient();

      if (latest) {
        await supabase.from("shopping_checks").upsert(
          {
            household_id: householdId,
            user_id: currentUserId,
            scope: mode,
            product_id: productId,
            unit,
            quantity_at_check: latest.quantityAtCheck,
          },
          { onConflict: "household_id,user_id,scope,product_id,unit" },
        );
      } else {
        await supabase
          .from("shopping_checks")
          .delete()
          .eq("household_id", householdId)
          .eq("user_id", currentUserId)
          .eq("scope", mode)
          .eq("product_id", productId)
          .eq("unit", unit);
      }
    }, SYNC_DEBOUNCE_MS);

    timersRef.current.set(key, timer);
  };

  const handleToggle = (item: ShoppingItem) => {
    if (!currentUserId) return;
    const wasCovered = item.covered;

    setLocalChecks((prev) => {
      const filtered = prev.filter(
        (c) => !(c.productId === item.productId && c.unit === item.unit && c.scope === mode),
      );
      if (wasCovered) return filtered;
      return [
        ...filtered,
        {
          id: `local-${item.productId}-${item.unit}-${Date.now()}`,
          scope: mode,
          productId: item.productId,
          unit: item.unit,
          quantityAtCheck: item.totalNeeded,
          checkedAt: new Date().toISOString(),
        },
      ];
    });

    scheduleSync(item.productId, item.unit);
  };

  return (
    <Card size="sm" className="h-full gap-2">
      <CardHeader>
        <CardTitle>Zakupy</CardTitle>
        <CardAction>
          <div className="flex">
            <Button
              variant={mode === "user" ? "secondary" : "ghost"}
              size="xs"
              aria-pressed={mode === "user"}
              onClick={() => setMode("user")}
            >
              ja
            </Button>
            <Button
              variant={mode === "household" ? "secondary" : "ghost"}
              size="xs"
              aria-pressed={mode === "household"}
              onClick={() => setMode("household")}
            >
              dom
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto min-h-0">
        {items.length === 0 ? (
          <span className="text-muted-foreground text-xs">brak pozycji</span>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <li key={shoppingItemKey(item.productId, item.unit)} className="flex items-center gap-2 group">
                <Checkbox
                  checked={item.covered}
                  onCheckedChange={() => handleToggle(item)}
                  aria-label={item.covered ? "odznacz" : "zaznacz"}
                />
                <span className={cn("text-xs flex-1 truncate", item.covered && "text-muted-foreground line-through")}>
                  {item.productName}
                </span>
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    item.covered ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {item.covered
                    ? `${formatQty(item.checkedQty)}${item.unit}`
                    : `${formatQty(item.remaining)}${item.unit}`}
                </span>
                {!item.covered && item.checkedQty > 0 && (
                  <span
                    className="text-[0.5rem] uppercase tracking-widest text-muted-foreground"
                    title={`mam ${formatQty(item.checkedQty)}${item.unit}`}
                  >
                    cz.
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
