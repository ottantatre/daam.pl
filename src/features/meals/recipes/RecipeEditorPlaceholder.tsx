"use client";

import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function RecipeEditorPlaceholder() {
  const { setNodeRef, isOver } = useDroppable({
    id: "recipe-editor-placeholder",
    data: { type: "recipe-drop" },
  });

  return (
    <Card
      ref={setNodeRef}
      size="sm"
      className={cn("h-full transition-shadow", isOver && "ring-2 ring-foreground/40 bg-muted/30")}
    >
      <CardContent className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-muted-foreground text-xs uppercase tracking-widest">edytor przepisu</span>
          <span className="text-muted-foreground text-xs">
            {isOver ? "upuść — utworzę nowy przepis" : "wybierz przepis z prawej lub utwórz nowy"}
          </span>
          <span className="text-muted-foreground text-[0.5rem] uppercase tracking-widest">albo przeciągnij produkt</span>
        </div>
      </CardContent>
    </Card>
  );
}
