"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useAsyncRefresh } from "@/lib/useAsyncRefresh";
import { Product, ProductCategory } from "../types";
import { UNITS, Unit, UNIVERSAL_UNITS } from "../units";

interface Props {
  householdId: string;
  categories: ProductCategory[];
  product?: Product;
  onClose: () => void;
}

const NO_CATEGORY = "__none__";

const CONVERTIBLE_UNITS: Unit[] = UNITS.filter((u) => !UNIVERSAL_UNITS.includes(u)) as Unit[];

type ConversionDraft = {
  unit: Unit;
  gramsPerUnit: string;
};

export function ProductFormModal({ householdId, categories, product, onClose }: Props) {
  const editing = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState<string>(product?.categoryId ?? NO_CATEGORY);
  const [kcal, setKcal] = useState(product?.kcalPer100g != null ? String(product.kcalPer100g) : "");
  const [protein, setProtein] = useState(product?.proteinPer100g != null ? String(product.proteinPer100g) : "");
  const [fat, setFat] = useState(product?.fatPer100g != null ? String(product.fatPer100g) : "");
  const [carbs, setCarbs] = useState(product?.carbsPer100g != null ? String(product.carbsPer100g) : "");
  const [notes, setNotes] = useState(product?.notes ?? "");
  const [conversions, setConversions] = useState<ConversionDraft[]>(() => {
    if (!product) return [];
    return Object.entries(product.unitConversions ?? {}).map(([unit, grams]) => ({
      unit: unit as Unit,
      gramsPerUnit: String(grams),
    }));
  });

  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useAsyncRefresh(onClose);

  const numOrNull = (s: string): number | null => {
    if (s.trim() === "") return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };

  const disabled = !name.trim() || fetching;

  const addConversion = () => {
    const used = new Set(conversions.map((c) => c.unit));
    const next = CONVERTIBLE_UNITS.find((u) => !used.has(u));
    if (!next) return;
    setConversions((prev) => [...prev, { unit: next, gramsPerUnit: "" }]);
  };
  const updateConversion = (i: number, patch: Partial<ConversionDraft>) =>
    setConversions((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const removeConversion = (i: number) =>
    setConversions((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (disabled) return;
    setFetching(true);
    setError(null);

    const conversionMap: Record<string, number> = {};
    for (const c of conversions) {
      const g = Number(c.gramsPerUnit);
      if (!Number.isFinite(g) || g <= 0) continue;
      conversionMap[c.unit] = g;
    }

    const payload = {
      household_id: householdId,
      category_id: categoryId === NO_CATEGORY ? null : categoryId,
      name: name.trim(),
      kcal_per_100g: numOrNull(kcal),
      protein_per_100g: numOrNull(protein),
      fat_per_100g: numOrNull(fat),
      carbs_per_100g: numOrNull(carbs),
      unit_conversions: conversionMap,
      notes: notes.trim() || null,
    };

    const supabase = createClient();
    if (editing && product) {
      const { error: err } = await supabase.from("products").update(payload).eq("id", product.id);
      if (err) {
        setError(err.message);
        setFetching(false);
        return;
      }
    } else {
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data.user?.id;
      const { error: err } = await supabase.from("products").insert({ ...payload, created_by: userId });
      if (err) {
        setError(err.message);
        setFetching(false);
        return;
      }
    }

    setFetching(false);
    refresh();
  };

  const handleDelete = async () => {
    if (!product?.id || fetching) return;
    setFetching(true);
    setError(null);
    const supabase = createClient();

    // Count recipes referencing this product so we can warn the user.
    const usage = await supabase
      .from("recipe_ingredients")
      .select("recipe_id", { count: "exact", head: true })
      .eq("product_id", product.id);
    const usageCount = usage.count ?? 0;

    const msg =
      usageCount > 0
        ? `Usunąć produkt "${product.name}"? Składnik zniknie z ${usageCount} przepis${usageCount === 1 ? "u" : usageCount < 5 ? "ów" : "ów"}.`
        : `Usunąć produkt "${product.name}"?`;

    if (!confirm(msg)) {
      setFetching(false);
      return;
    }

    const { error: err } = await supabase.from("products").delete().eq("id", product.id);
    if (err) {
      setError(err.message);
      setFetching(false);
      return;
    }
    setFetching(false);
    refresh();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edytuj produkt" : "Nowy produkt"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="product-name">nazwa</Label>
            <Input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1">
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

          <div>
            <Label>makra na 100g</Label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              <Input placeholder="kcal" type="number" value={kcal} onChange={(e) => setKcal(e.target.value)} />
              <Input placeholder="białko" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
              <Input placeholder="tłuszcz" type="number" value={fat} onChange={(e) => setFat(e.target.value)} />
              <Input placeholder="węgle" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>
              przeliczniki jednostek
              <span className="text-muted-foreground text-[0.5rem] uppercase tracking-widest ml-2">
                g/kg wbudowane
              </span>
            </Label>
            {conversions.map((c, i) => (
              <div key={i} className="flex gap-1 items-center">
                <Select
                  value={c.unit}
                  onValueChange={(v) => updateConversion(i, { unit: v as Unit })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONVERTIBLE_UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground text-xs">=</span>
                <Input
                  type="number"
                  step="0.001"
                  placeholder="g"
                  className="w-24"
                  value={c.gramsPerUnit}
                  onChange={(e) => updateConversion(i, { gramsPerUnit: e.target.value })}
                />
                <span className="text-muted-foreground text-xs">g</span>
                <Button variant="ghost" size="icon-sm" onClick={() => removeConversion(i)}>
                  <Trash2 />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="xs"
              onClick={addConversion}
              className="self-start mt-1"
              disabled={conversions.length >= CONVERTIBLE_UNITS.length}
            >
              <Plus />
              przelicznik
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="product-notes">notatki</Label>
            <Textarea id="product-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {error && <span className="text-destructive text-xs">{error}</span>}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          {editing ? (
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={fetching}>
              usuń
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} disabled={fetching}>
              anuluj
            </Button>
            <Button size="sm" onClick={handleSave} disabled={disabled}>
              {editing ? "zapisz" : "utwórz"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
