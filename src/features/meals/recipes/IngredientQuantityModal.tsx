"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "../types";
import { Unit, availableUnits, toGrams } from "../units";
import { ingredientMacros } from "../macros";

interface Props {
  product: Product;
  onConfirm: (quantity: number, unit: Unit) => void;
  onClose: () => void;
}

export function IngredientQuantityModal({ product, onConfirm, onClose }: Props) {
  const units = availableUnits(product.unitConversions);
  const [quantity, setQuantity] = useState("100");
  const [unit, setUnit] = useState<Unit>(units[0] ?? "g");

  const qty = Number(quantity);
  const valid = qty > 0 && units.includes(unit);

  const preview = valid
    ? ingredientMacros(
        { id: "", productId: product.id, quantity: qty, unit, sortOrder: 0 },
        product,
      )
    : null;
  const grams = valid ? toGrams(qty, unit, product.unitConversions) : null;

  const handleConfirm = () => {
    if (!valid) return;
    onConfirm(qty, unit);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Dodaj {product.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-end">
            <div className="flex flex-col gap-1 flex-1">
              <Label htmlFor="ing-qty">ilość</Label>
              <Input
                id="ing-qty"
                type="number"
                step="0.001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1 w-24">
              <Label>jedn.</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                <SelectTrigger>
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
            </div>
          </div>

          {preview && (
            <div className="text-xs text-muted-foreground flex gap-2 tabular-nums">
              {grams !== null && <span>= {Math.round(grams)}g</span>}
              <span>·</span>
              <span>{Math.round(preview.kcal)} kcal</span>
              <span>b {Math.round(preview.proteinG)}</span>
              <span>t {Math.round(preview.fatG)}</span>
              <span>w {Math.round(preview.carbsG)}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>
            anuluj
          </Button>
          <Button size="sm" onClick={handleConfirm} disabled={!valid}>
            dodaj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
