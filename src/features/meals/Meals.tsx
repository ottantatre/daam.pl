"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createClient } from "@/lib/supabase/client";
import { MealPlanEntry, MealsData, Recipe } from "./types";
import { currentWeek, formatDateISO, plansByDate } from "./mealUtils";
import { DayColumn } from "./DayColumn";
import { RecipesPanel } from "./RecipesPanel";
import { ShoppingListPanel } from "./ShoppingListPanel";

interface Props {
  data: MealsData;
}

export default function Meals({ data }: Props) {
  const router = useRouter();
  const days = useMemo(() => currentWeek(), []);
  const todayISO = useMemo(() => formatDateISO(new Date()), []);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [extraPlans, setExtraPlans] = useState<MealPlanEntry[]>([]);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: u }) => setCurrentUserId(u.user?.id ?? null));
  }, []);

  useEffect(() => {
    setExtraPlans([]);
  }, [data.plans]);

  const recipesById = useMemo(() => new Map(data.recipes.map((r) => [r.id, r])), [data.recipes]);
  const productsById = useMemo(() => new Map(data.products.map((p) => [p.id, p])), [data.products]);
  const allPlans = useMemo(() => [...data.plans, ...extraPlans], [data.plans, extraPlans]);
  const byDate = useMemo(() => plansByDate(allPlans), [allPlans]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = (event: DragStartEvent) => {
    const recipeId = event.active.data.current?.recipeId as string | undefined;
    if (recipeId) setActiveRecipe(recipesById.get(recipeId) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveRecipe(null);
    const { active, over } = event;
    if (!over || !currentUserId || !data.household) return;
    const recipeId = active.data.current?.recipeId as string | undefined;
    const dateISO = over.data.current?.dateISO as string | undefined;
    if (!recipeId || !dateISO) return;

    const myPlansForDay = allPlans.filter((p) => p.date === dateISO && p.userId === currentUserId);
    const maxPos = myPlansForDay.reduce((m, p) => Math.max(m, p.position), -1);
    const nextPos = maxPos + 1;

    const tempPlan: MealPlanEntry = {
      id: `temp-${Date.now()}-${Math.random()}`,
      userId: currentUserId,
      date: dateISO,
      recipeId,
      servingsMultiplier: 1,
      position: nextPos,
    };

    setExtraPlans((prev) => [...prev, tempPlan]);

    void (async () => {
      const supabase = createClient();
      const { error } = await supabase.from("meal_plans").insert({
        user_id: currentUserId,
        household_id: data.household!.id,
        date: dateISO,
        recipe_id: recipeId,
        servings_multiplier: 1,
        position: nextPos,
      });
      if (error) {
        setExtraPlans((prev) => prev.filter((p) => p.id !== tempPlan.id));
        return;
      }
      router.refresh();
    })();
  };

  return (
    <DndContext id="meals-dnd" sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="fixed inset-0 top-12 grid grid-cols-8 gap-2 p-2">
        {days.map((day) => {
          const iso = formatDateISO(day);
          const all = byDate.get(iso) ?? [];
          const mine = currentUserId ? all.filter((p) => p.userId === currentUserId) : [];
          const others = currentUserId ? all.filter((p) => p.userId !== currentUserId) : all;
          return (
            <DayColumn
              key={iso}
              date={day}
              dateISO={iso}
              isToday={iso === todayISO}
              myPlans={mine}
              othersPlans={others}
              recipesById={recipesById}
              productsById={productsById}
            />
          );
        })}

        <div className="grid grid-rows-2 gap-2 min-h-0">
          <RecipesPanel categories={data.recipeCategories} recipes={data.recipes} />
          <ShoppingListPanel
            householdId={data.household!.id}
            plans={allPlans}
            recipes={data.recipes}
            products={data.products}
            checks={data.checks}
            currentUserId={currentUserId}
          />
        </div>
      </main>

      <DragOverlay dropAnimation={null}>
        {activeRecipe && (
          <div className="text-xs bg-card px-2 py-1 ring-1 ring-foreground/20 shadow-md pointer-events-none">
            {activeRecipe.name}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
