import { redirect } from "next/navigation";
import { Header } from "@/components";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserPermissions, PERM } from "@/lib/permissions";
import { fetchMealsData } from "@/lib/supabase/meals";
import { RecipesPage } from "@/features/meals/recipes/RecipesPage";

export default async function MealsRecipesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const perms = await getCurrentUserPermissions();
  if (!perms.has(PERM.VIEW_MEALS)) redirect("/");

  const data = await fetchMealsData();
  if (!data.household) redirect("/meals");

  return (
    <>
      <Header />
      <RecipesPage data={data} />
    </>
  );
}
