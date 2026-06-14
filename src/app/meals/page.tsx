import { redirect } from "next/navigation";
import { Header } from "@/components";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserPermissions, PERM } from "@/lib/permissions";
import { fetchMealsData } from "@/lib/supabase/meals";
import { CreateHouseholdForm } from "@/features/meals/CreateHouseholdForm";
import Meals from "@/features/meals/Meals";

export default async function MealsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const perms = await getCurrentUserPermissions();
  if (!perms.has(PERM.VIEW_MEALS)) redirect("/");

  const data = await fetchMealsData();

  return (
    <>
      <Header />
      {data.household ? <Meals data={data} /> : <CreateHouseholdForm />}
    </>
  );
}
