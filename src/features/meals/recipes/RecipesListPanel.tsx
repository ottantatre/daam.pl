"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Recipe, RecipeCategory } from "../types";

interface Props {
  categories: RecipeCategory[];
  recipes: Recipe[];
  selectedId: string | "new" | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function RecipesListPanel({ categories, recipes, selectedId, onSelect, onNew }: Props) {
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
          <Button variant="ghost" size="xs" onClick={onNew} aria-pressed={selectedId === "new"}>
            <Plus />
            przepis
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
                    <RecipeRow
                      key={r.id}
                      recipe={r}
                      selected={selectedId === r.id}
                      onClick={() => onSelect(r.id)}
                    />
                  ))}
                </div>
              );
            })}
            {(byCategory.get(null) ?? []).length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="uppercase tracking-widest text-[0.5rem] text-muted-foreground">bez kategorii</span>
                {(byCategory.get(null) ?? []).map((r) => (
                  <RecipeRow
                    key={r.id}
                    recipe={r}
                    selected={selectedId === r.id}
                    onClick={() => onSelect(r.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function RecipeRow({ recipe, selected, onClick }: { recipe: Recipe; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-xs text-left truncate px-1 -mx-1 py-0.5 cursor-pointer",
        selected ? "bg-muted text-foreground" : "hover:bg-muted",
      )}
    >
      {recipe.name}
    </button>
  );
}
