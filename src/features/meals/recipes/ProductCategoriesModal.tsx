"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAsyncRefresh } from "@/lib/useAsyncRefresh";
import { ProductCategory } from "../types";

interface Props {
  householdId: string;
  categories: ProductCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductCategoriesModal({ householdId, categories, open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useAsyncRefresh(() => {});

  const handleAdd = async () => {
    if (!name.trim() || fetching) return;
    setFetching(true);
    setError(null);
    const supabase = createClient();
    const sortOrder = (categories[categories.length - 1]?.sortOrder ?? 0) + 1;
    const { error: err } = await supabase
      .from("product_categories")
      .insert({ household_id: householdId, name: name.trim(), sort_order: sortOrder });
    if (err) {
      setError(err.message);
      setFetching(false);
      return;
    }
    setName("");
    setFetching(false);
    refresh();
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error: err } = await supabase.from("product_categories").delete().eq("id", id);
    if (err) {
      setError(err.message);
      return;
    }
    refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Kategorie produktów</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          {categories.length === 0 && (
            <span className="text-muted-foreground text-xs">brak kategorii</span>
          )}
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2 group">
              <span className="text-xs flex-1 truncate">{c.name}</span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="opacity-0 group-hover:opacity-100"
                onClick={() => handleDelete(c.id)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="nowa kategoria"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoComplete="off"
          />
          <Button size="sm" onClick={handleAdd} disabled={!name.trim() || fetching}>
            dodaj
          </Button>
        </div>

        {error && <span className="text-destructive text-xs">{error}</span>}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" size="sm">
              zamknij
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
