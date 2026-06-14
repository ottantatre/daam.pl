"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";
import { Recipe, RecipeCategory } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  categories: RecipeCategory[];
  recipes: Recipe[];
}

export function RecipesPanel({ categories, recipes }: Props) {
  const router = useRouter();

  const byCategory = new Map<string | null, Recipe[]>();
  for (const r of recipes) {
    const key = r.categoryId;
    const arr = byCategory.get(key) ?? [];
    arr.push(r);
    byCategory.set(key, arr);
  }

  return (
    <Card size="sm" className="h-full gap-2">
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2">
          <span>Przepisy</span>
          <span className="text-muted-foreground tabular-nums text-xs">{recipes.length}</span>
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="xs" onClick={() => router.push("/meals/recipes")}>
            <Plus />
            edytuj
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-0">
        {recipes.length === 0 ? (
          <span className="text-muted-foreground text-xs">brak przepisów</span>
        ) : (
          <>
            {categories.map((cat) => {
              const list = byCategory.get(cat.id) ?? [];
              if (list.length === 0) return null;
              return (
                <div key={cat.id} className="flex flex-col gap-1">
                  <span className="uppercase tracking-widest text-[0.5rem] text-muted-foreground">{cat.name}</span>
                  {list.map((r) => (
                    <RecipeRow key={r.id} recipe={r} />
                  ))}
                </div>
              );
            })}
            {(byCategory.get(null) ?? []).length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="uppercase tracking-widest text-[0.5rem] text-muted-foreground">bez kategorii</span>
                {(byCategory.get(null) ?? []).map((r) => (
                  <RecipeRow key={r.id} recipe={r} />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function RecipeRow({ recipe }: { recipe: Recipe }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `recipe:${recipe.id}`,
    data: { type: "recipe", recipeId: recipe.id },
  });

  return (
    <button
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.3 : undefined }}
      {...listeners}
      {...attributes}
      className={cn(
        "text-xs text-left truncate hover:bg-muted px-1 -mx-1 py-0.5 cursor-grab active:cursor-grabbing touch-none",
      )}
    >
      {recipe.name}
    </button>
  );
}
