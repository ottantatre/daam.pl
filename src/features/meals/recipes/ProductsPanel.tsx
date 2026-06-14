"use client";

import { useState } from "react";
import { FolderTree, Plus, Pencil } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Product, ProductCategory } from "../types";
import { ProductFormModal } from "./ProductFormModal";
import { ProductCategoriesModal } from "./ProductCategoriesModal";

interface Props {
  householdId: string;
  categories: ProductCategory[];
  products: Product[];
}

export function ProductsPanel({ householdId, categories, products }: Props) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  const byCategory = new Map<string | null, Product[]>();
  for (const p of products) {
    const key = p.categoryId;
    const arr = byCategory.get(key) ?? [];
    arr.push(p);
    byCategory.set(key, arr);
  }

  const openCreate = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };
  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setShowProductForm(true);
  };

  return (
    <Card size="sm" className="h-full gap-2">
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2">
          <span>Produkty</span>
          <span className="text-muted-foreground tabular-nums text-xs">{products.length}</span>
        </CardTitle>
        <CardAction>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowCategories(true)}
              title="kategorie produktów"
            >
              <FolderTree />
            </Button>
            <Button variant="ghost" size="xs" onClick={openCreate}>
              <Plus />
              produkt
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-0">
        {products.length === 0 ? (
          <span className="text-muted-foreground text-xs">brak produktów</span>
        ) : (
          <>
            {categories.map((cat) => {
              const list = byCategory.get(cat.id) ?? [];
              if (list.length === 0) return null;
              return (
                <div key={cat.id} className="flex flex-col gap-1">
                  <span className="uppercase tracking-widest text-[0.5rem] text-muted-foreground">{cat.name}</span>
                  {list.map((p) => (
                    <ProductRow key={p.id} product={p} onEdit={() => openEdit(p)} />
                  ))}
                </div>
              );
            })}
            {(byCategory.get(null) ?? []).length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="uppercase tracking-widest text-[0.5rem] text-muted-foreground">bez kategorii</span>
                {(byCategory.get(null) ?? []).map((p) => (
                  <ProductRow key={p.id} product={p} onEdit={() => openEdit(p)} />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>

      {showProductForm && (
        <ProductFormModal
          householdId={householdId}
          categories={categories}
          product={editingProduct ?? undefined}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <ProductCategoriesModal
        householdId={householdId}
        categories={categories}
        open={showCategories}
        onOpenChange={setShowCategories}
      />
    </Card>
  );
}

function ProductRow({ product, onEdit }: { product: Product; onEdit: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `product:${product.id}`,
    data: { type: "product", productId: product.id },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.3 : undefined }}
      className={cn(
        "flex items-center gap-2 hover:bg-muted px-1 -mx-1 py-0.5 group cursor-grab active:cursor-grabbing touch-none",
      )}
      {...listeners}
      {...attributes}
    >
      <span className="text-xs truncate flex-1">{product.name}</span>
      {product.kcalPer100g !== null && (
        <span className="text-muted-foreground tabular-nums text-[0.5rem]">{Math.round(product.kcalPer100g)} kcal</span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
        title="edytuj"
      >
        <Pencil size={10} strokeWidth={1.5} />
      </button>
    </div>
  );
}
