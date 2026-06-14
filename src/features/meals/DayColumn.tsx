"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { MealPlanEntry, Product, Recipe } from "./types";
import { dayShortLabel, sumMacrosForDay } from "./mealUtils";
import { Macros } from "./macros";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  date: Date;
  dateISO: string;
  isToday: boolean;
  myPlans: MealPlanEntry[];
  othersPlans: MealPlanEntry[];
  recipesById: Map<string, Recipe>;
  productsById: Map<string, Product>;
}

export function DayColumn({
  date,
  dateISO,
  isToday,
  myPlans,
  othersPlans,
  recipesById,
  productsById,
}: Props) {
  const macros = sumMacrosForDay(myPlans, recipesById, productsById);
  const otherHints = aggregateHints(othersPlans, recipesById);
  const { setNodeRef, isOver } = useDroppable({
    id: `day:${dateISO}`,
    data: { type: "day", dateISO },
  });

  return (
    <Card
      ref={setNodeRef}
      size="sm"
      className={cn(
        "h-full gap-2 transition-shadow",
        isToday && "ring-foreground/30",
        isOver && "ring-2 ring-foreground/60 bg-muted/30",
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2">
          <span className="tabular-nums">{date.getDate()}</span>
          <span className="text-muted-foreground uppercase tracking-widest text-[0.5rem]">{dayShortLabel(date)}</span>
        </CardTitle>
      </CardHeader>

      {otherHints.length > 0 && (
        <>
          <Separator />
          <CardContent className="flex flex-col gap-0.5">
            <span className="uppercase tracking-widest text-[0.5rem] text-muted-foreground">inni</span>
            {otherHints.map((h) => (
              <div key={h.recipeId} className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground truncate flex-1">{h.name}</span>
                {h.count > 1 && <span className="text-muted-foreground tabular-nums">×{h.count}</span>}
              </div>
            ))}
          </CardContent>
        </>
      )}

      <CardContent className="flex-1 overflow-y-auto flex flex-col gap-0.5 min-h-0">
        {myPlans.length === 0 ? (
          <span className="text-muted-foreground text-xs">{isOver ? "upuść tu" : "—"}</span>
        ) : (
          myPlans.map((p) => {
            const r = recipesById.get(p.recipeId);
            return (
              <div key={p.id} className="flex items-center gap-1">
                <span className="truncate flex-1 text-xs">{r?.name ?? "?"}</span>
                {p.servingsMultiplier !== 1 && (
                  <span className="text-muted-foreground text-[0.5rem] tabular-nums">×{p.servingsMultiplier}</span>
                )}
              </div>
            );
          })
        )}
      </CardContent>

      <CardFooter className="grid grid-cols-4 gap-1">
        <MacroCell label="kcal" value={macros.kcal} />
        <MacroCell label="b" value={macros.proteinG} />
        <MacroCell label="t" value={macros.fatG} />
        <MacroCell label="w" value={macros.carbsG} />
      </CardFooter>
    </Card>
  );
}

function MacroCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="uppercase tracking-widest text-[0.5rem] text-muted-foreground">{label}</span>
      <span className="tabular-nums text-xs">{value > 0 ? Math.round(value) : "—"}</span>
    </div>
  );
}

type Hint = { recipeId: string; name: string; count: number };

function aggregateHints(plans: MealPlanEntry[], recipesById: Map<string, Recipe>): Hint[] {
  const map = new Map<string, Hint>();
  for (const p of plans) {
    const r = recipesById.get(p.recipeId);
    if (!r) continue;
    const existing = map.get(p.recipeId);
    if (existing) existing.count += 1;
    else map.set(p.recipeId, { recipeId: p.recipeId, name: r.name, count: 1 });
  }
  return [...map.values()];
}

// Unused export to satisfy callers that may import — kept minimal.
export type DayMacros = Macros;
