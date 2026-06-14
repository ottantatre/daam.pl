"use client";

import { useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { MealsData, Product } from "../types";
import { Unit } from "../units";
import { ProductsPanel } from "./ProductsPanel";
import { RecipeEditor, EditorAddHandle } from "./RecipeEditor";
import { RecipeEditorPlaceholder } from "./RecipeEditorPlaceholder";
import { RecipesListPanel } from "./RecipesListPanel";
import { IngredientQuantityModal } from "./IngredientQuantityModal";

interface Props {
  data: MealsData;
}

type SelectedId = string | "new" | null;

export function RecipesPage({ data }: Props) {
  const [selectedId, setSelectedId] = useState<SelectedId>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  const productsById = useMemo(() => new Map(data.products.map((p) => [p.id, p])), [data.products]);
  const recipesById = useMemo(() => new Map(data.recipes.map((r) => [r.id, r])), [data.recipes]);

  // Imperative handle exposed by the editor so we can push ingredients after
  // the user confirms the quantity modal. Replaces the fragile queue/consume pattern.
  const editorAddRef = useRef<EditorAddHandle | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragStart = (event: DragStartEvent) => {
    const productId = event.active.data.current?.productId as string | undefined;
    if (productId) setActiveProduct(productsById.get(productId) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveProduct(null);
    const { active, over } = event;
    if (!over) return;
    if (over.data.current?.type !== "recipe-drop") return;
    const productId = active.data.current?.productId as string | undefined;
    if (!productId) return;

    // If nothing was selected, promote to a new draft so the editor mounts.
    if (selectedId === null) setSelectedId("new");
    const product = productsById.get(productId);
    if (!product) return;
    setPendingProduct(product);
  };

  const handleConfirmQty = (quantity: number, unit: Unit) => {
    if (!pendingProduct) return;
    // Editor mounts in the same render that selectedId was promoted, so its
    // useEffect has already attached the handle by the time this fires (modal
    // can't appear before the editor is on screen).
    editorAddRef.current?.(pendingProduct.id, quantity, unit);
    setPendingProduct(null);
  };

  const center = (() => {
    if (selectedId === null) return <RecipeEditorPlaceholder />;
    const recipe = selectedId === "new" ? null : recipesById.get(selectedId) ?? null;
    return (
      <RecipeEditor
        key={selectedId}
        householdId={data.household!.id}
        categories={data.recipeCategories}
        productsById={productsById}
        recipe={recipe}
        addHandleRef={editorAddRef}
        onSaved={(id) => setSelectedId(id)}
        onDeleted={() => setSelectedId(null)}
        onCancel={() => setSelectedId(null)}
      />
    );
  })();

  return (
    <DndContext id="meals-recipes-dnd" sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="fixed inset-0 top-12 grid grid-cols-12 gap-2 p-2">
        <div className="col-span-3 min-h-0">
          <ProductsPanel
            householdId={data.household!.id}
            categories={data.productCategories}
            products={data.products}
          />
        </div>
        <div className="col-span-6 min-h-0">{center}</div>
        <div className="col-span-3 min-h-0">
          <RecipesListPanel
            categories={data.recipeCategories}
            recipes={data.recipes}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
            onNew={() => setSelectedId("new")}
          />
        </div>
      </main>

      <DragOverlay dropAnimation={null}>
        {activeProduct && (
          <div className="text-xs bg-card px-2 py-1 ring-1 ring-foreground/20 shadow-md pointer-events-none">
            {activeProduct.name}
          </div>
        )}
      </DragOverlay>

      {pendingProduct && (
        <IngredientQuantityModal
          product={pendingProduct}
          onConfirm={handleConfirmQty}
          onClose={() => setPendingProduct(null)}
        />
      )}
    </DndContext>
  );
}
