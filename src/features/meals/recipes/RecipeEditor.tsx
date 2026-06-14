"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Product, Recipe, RecipeCategory, RecipeIngredient, RecipeStep } from "../types";
import { Unit, availableUnits, toGrams } from "../units";
import { ingredientMacros, recipeMacros, recipePerServingMacros, ZERO_MACROS } from "../macros";

export type EditorAddHandle = (productId: string, quantity: number, unit: Unit) => void;

interface Props {
  householdId: string;
  categories: RecipeCategory[];
  productsById: Map<string, Product>;
  recipe: Recipe | null;
  addHandleRef: React.MutableRefObject<EditorAddHandle | null>;
  onSaved: (recipeId: string) => void;
  onDeleted: () => void;
  onCancel: () => void;
}

const NO_CATEGORY = "__none__";

type IngDraft = {
  tempId: string;
  productId: string;
  quantity: number;
  unit: Unit;
};

type StepDraft = {
  tempId: string;
  content: string;
};

let nextTempId = 1;
const makeTempId = () => `t-${nextTempId++}`;

export function RecipeEditor({
  householdId,
  categories,
  productsById,
  recipe,
  addHandleRef,
  onSaved,
  onDeleted,
  onCancel,
}: Props) {
  const editing = !!recipe;
  const router = useRouter();

  const [name, setName] = useState(recipe?.name ?? "");
  const [servings, setServings] = useState(recipe ? String(recipe.servings) : "1");
  const [categoryId, setCategoryId] = useState(recipe?.categoryId ?? NO_CATEGORY);
  const [notes, setNotes] = useState(recipe?.notes ?? "");
  const [ingredients, setIngredients] = useState<IngDraft[]>(
    () =>
      recipe?.ingredients.map((i) => ({
        tempId: makeTempId(),
        productId: i.productId,
        quantity: i.quantity,
        unit: i.unit,
      })) ?? [],
  );
  const [steps, setSteps] = useState<StepDraft[]>(
    () => recipe?.steps.map((s) => ({ tempId: makeTempId(), content: s.content })) ?? [],
  );
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  // Track name via ref so the imperative add callback can read latest value
  // without re-binding on every keystroke.
  const nameRef = useRef(name);
  useEffect(() => {
    nameRef.current = name;
  }, [name]);

  // Expose imperative add to parent (called after IngredientQuantityModal confirm).
  // After adding, focus the name input if it's still empty — user just dropped a
  // product but hasn't named the recipe yet, so prompt them.
  useEffect(() => {
    addHandleRef.current = (productId, quantity, unit) => {
      setIngredients((prev) => [...prev, { tempId: makeTempId(), productId, quantity, unit }]);
      if (!nameRef.current.trim()) {
        // Defer so the focus runs after Dialog finishes closing and restoring focus.
        setTimeout(() => nameInputRef.current?.focus(), 0);
      }
    };
    return () => {
      addHandleRef.current = null;
    };
  }, [addHandleRef]);

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: "recipe-editor-ingredients",
    data: { type: "recipe-drop" },
  });

  const servingsN = Number(servings);

  const draftAsRecipe = useMemo<Recipe>(
    () => ({
      id: recipe?.id ?? "draft",
      categoryId: categoryId === NO_CATEGORY ? null : categoryId,
      name,
      servings: servingsN > 0 ? servingsN : 1,
      notes,
      ingredients: ingredients.map<RecipeIngredient>((i, idx) => ({
        id: i.tempId,
        productId: i.productId,
        quantity: i.quantity,
        unit: i.unit,
        sortOrder: idx,
      })),
      steps: steps.map<RecipeStep>((s, idx) => ({
        id: s.tempId,
        orderIndex: idx,
        content: s.content,
      })),
    }),
    [recipe?.id, categoryId, name, servingsN, notes, ingredients, steps],
  );

  const total = useMemo(() => recipeMacros(draftAsRecipe, productsById), [draftAsRecipe, productsById]);
  const perServing = useMemo(
    () => recipePerServingMacros(draftAsRecipe, productsById),
    [draftAsRecipe, productsById],
  );

  const updateIngredient = (tempId: string, patch: Partial<Omit<IngDraft, "tempId">>) => {
    setIngredients((prev) => prev.map((i) => (i.tempId === tempId ? { ...i, ...patch } : i)));
  };
  const removeIngredient = (tempId: string) =>
    setIngredients((prev) => prev.filter((i) => i.tempId !== tempId));

  const addStep = () => setSteps((prev) => [...prev, { tempId: makeTempId(), content: "" }]);
  const updateStep = (tempId: string, content: string) =>
    setSteps((prev) => prev.map((s) => (s.tempId === tempId ? { ...s, content } : s)));
  const removeStep = (tempId: string) => setSteps((prev) => prev.filter((s) => s.tempId !== tempId));
  const moveStep = (tempId: string, dir: -1 | 1) =>
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.tempId === tempId);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });

  const disabled = !name.trim() || servingsN <= 0 || fetching;

  const handleSave = async () => {
    if (disabled) return;
    setFetching(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      household_id: householdId,
      category_id: categoryId === NO_CATEGORY ? null : categoryId,
      name: name.trim(),
      servings: servingsN,
      notes: notes.trim() || null,
    };

    let recipeId = recipe?.id;
    if (editing && recipeId) {
      const upd = await supabase.from("recipes").update(payload).eq("id", recipeId);
      if (upd.error) {
        setError(upd.error.message);
        setFetching(false);
        return;
      }
      await supabase.from("recipe_ingredients").delete().eq("recipe_id", recipeId);
      await supabase.from("recipe_steps").delete().eq("recipe_id", recipeId);
    } else {
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data.user?.id;
      const ins = await supabase
        .from("recipes")
        .insert({ ...payload, created_by: userId })
        .select()
        .single();
      if (ins.error || !ins.data) {
        setError(ins.error?.message ?? "Insert failed");
        setFetching(false);
        return;
      }
      recipeId = ins.data.id;
    }

    if (ingredients.length > 0 && recipeId) {
      const rows = ingredients.map((i, idx) => ({
        recipe_id: recipeId!,
        product_id: i.productId,
        quantity: i.quantity,
        unit: i.unit,
        sort_order: idx,
      }));
      const ingRes = await supabase.from("recipe_ingredients").insert(rows);
      if (ingRes.error) {
        setError(ingRes.error.message);
        setFetching(false);
        return;
      }
    }

    if (steps.length > 0 && recipeId) {
      const rows = steps
        .filter((s) => s.content.trim())
        .map((s, idx) => ({
          recipe_id: recipeId!,
          order_index: idx,
          content: s.content.trim(),
        }));
      if (rows.length > 0) {
        const stepRes = await supabase.from("recipe_steps").insert(rows);
        if (stepRes.error) {
          setError(stepRes.error.message);
          setFetching(false);
          return;
        }
      }
    }

    setFetching(false);
    router.refresh();
    onSaved(recipeId!);
  };

  const handleDelete = async () => {
    if (!recipe?.id || fetching) return;
    if (!confirm(`Usunąć przepis "${recipe.name}"?`)) return;
    setFetching(true);
    const supabase = createClient();
    const { error: err } = await supabase.from("recipes").delete().eq("id", recipe.id);
    if (err) {
      setError(err.message);
      setFetching(false);
      return;
    }
    setFetching(false);
    router.refresh();
    onDeleted();
  };

  return (
    <Card size="sm" className="h-full gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Input
            ref={nameInputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="nazwa przepisu"
            autoFocus={!editing}
            className="text-sm font-medium -mx-1"
          />
        </CardTitle>
        <CardAction>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={fetching}>
              anuluj
            </Button>
            {editing && (
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={fetching}>
                usuń
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={disabled}>
              {editing ? "zapisz" : "utwórz"}
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-0">
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <Label>kategoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CATEGORY}>bez kategorii</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1 w-24">
            <Label htmlFor="rcp-servings">porcje</Label>
            <Input
              id="rcp-servings"
              type="number"
              step="0.1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div
          ref={setDropRef}
          className={cn(
            "flex flex-col gap-1 min-h-20 p-1 transition-colors rounded-none",
            isOver && "bg-muted ring-2 ring-foreground/40",
          )}
        >
          <div className="flex items-center gap-2">
            <Label>składniki</Label>
            <span className="text-muted-foreground tabular-nums text-xs">{ingredients.length}</span>
          </div>
          {ingredients.length === 0 ? (
            <span className="text-muted-foreground text-xs py-2">
              {isOver ? "upuść produkt tu" : "przeciągnij produkt z lewej"}
            </span>
          ) : (
            ingredients.map((ing) => {
              const product = productsById.get(ing.productId);
              const units = product ? availableUnits(product.unitConversions) : ["g" as Unit];
              const macros = product
                ? ingredientMacros(
                    { id: "", productId: ing.productId, quantity: ing.quantity, unit: ing.unit, sortOrder: 0 },
                    product,
                  )
                : ZERO_MACROS;
              const grams = product ? toGrams(ing.quantity, ing.unit, product.unitConversions) : null;
              return (
                <div key={ing.tempId} className="grid grid-cols-[1fr_4rem_4rem_5rem_auto] gap-2 items-center">
                  <span className="text-xs truncate">{product?.name ?? "?"}</span>
                  <Input
                    type="number"
                    step="0.001"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(ing.tempId, { quantity: Number(e.target.value) })}
                    className="h-7"
                  />
                  <Select
                    value={ing.unit}
                    onValueChange={(v) => updateIngredient(ing.tempId, { unit: v as Unit })}
                  >
                    <SelectTrigger className="h-7">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground text-[0.5rem] tabular-nums">
                    {grams !== null ? `${Math.round(grams)}g · ${Math.round(macros.kcal)}kcal` : "?"}
                  </span>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeIngredient(ing.tempId)}>
                    <Trash2 />
                  </Button>
                </div>
              );
            })
          )}
        </div>

        <Separator />

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Label>kroki</Label>
            <span className="text-muted-foreground tabular-nums text-xs">{steps.length}</span>
          </div>
          {steps.map((step, i) => (
            <div key={step.tempId} className="flex gap-1 items-start">
              <span className="text-muted-foreground text-xs tabular-nums pt-2 w-4">{i + 1}.</span>
              <Textarea
                rows={2}
                value={step.content}
                onChange={(e) => updateStep(step.tempId, e.target.value)}
                placeholder="np. zmieszaj składniki, piecz 200°C 35 min"
                className="flex-1 min-h-0"
              />
              <div className="flex flex-col">
                <Button variant="ghost" size="icon-xs" onClick={() => moveStep(step.tempId, -1)} disabled={i === 0}>
                  <ChevronUp />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => moveStep(step.tempId, 1)}
                  disabled={i === steps.length - 1}
                >
                  <ChevronDown />
                </Button>
              </div>
              <Button variant="ghost" size="icon-xs" onClick={() => removeStep(step.tempId)}>
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button variant="ghost" size="xs" onClick={addStep} className="self-start mt-1">
            <Plus />
            krok
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col gap-1">
          <Label htmlFor="rcp-notes">notatki</Label>
          <Textarea
            id="rcp-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error && <span className="text-destructive text-xs">{error}</span>}
      </CardContent>

      <CardFooter className="grid grid-cols-4 gap-2 text-xs">
        <MacroCell label="kcal" total={total.kcal} per={perServing.kcal} />
        <MacroCell label="b" total={total.proteinG} per={perServing.proteinG} />
        <MacroCell label="t" total={total.fatG} per={perServing.fatG} />
        <MacroCell label="w" total={total.carbsG} per={perServing.carbsG} />
      </CardFooter>
    </Card>
  );
}

function MacroCell({ label, total, per }: { label: string; total: number; per: number }) {
  return (
    <div className="flex flex-col">
      <span className="uppercase tracking-widest text-[0.5rem] text-muted-foreground">{label}</span>
      <span className="tabular-nums">
        {Math.round(total)} <span className="text-muted-foreground text-[0.5rem]">/ {Math.round(per)} per</span>
      </span>
    </div>
  );
}
