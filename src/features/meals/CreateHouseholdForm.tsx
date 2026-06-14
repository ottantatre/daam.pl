"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAsyncRefresh } from "@/lib/useAsyncRefresh";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export function CreateHouseholdForm() {
  const [name, setName] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPending, refresh } = useAsyncRefresh(() => setError(null));

  const busy = fetching || isPending;
  const disabled = !name.trim() || busy;

  const handleCreate = async () => {
    if (disabled) return;
    setFetching(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Brak sesji");
      setFetching(false);
      return;
    }

    const householdRes = await supabase
      .from("households")
      .insert({ name: name.trim(), created_by: user.id })
      .select()
      .single();
    if (householdRes.error || !householdRes.data) {
      setError(householdRes.error?.message ?? "Tworzenie domu nieudane");
      setFetching(false);
      return;
    }

    const memberRes = await supabase
      .from("household_members")
      .insert({ household_id: householdRes.data.id, user_id: user.id });
    if (memberRes.error) {
      setError(memberRes.error.message);
      setFetching(false);
      return;
    }

    setFetching(false);
    refresh();
  };

  return (
    <div className="fixed inset-0 top-12 flex items-center justify-center p-4">
      <Card size="sm" className="w-80">
        <CardHeader>
          <CardTitle>Nowy dom</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="nazwa domu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoComplete="off"
            autoFocus
          />
          {error && <span className="text-destructive text-xs mt-2 block">{error}</span>}
        </CardContent>
        <CardFooter className="justify-end">
          <Button size="sm" disabled={disabled} onClick={handleCreate}>
            utwórz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
