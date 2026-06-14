import Image from "next/image";
import { Header, Grid, ModuleList } from "@/components";
import Calendar from "@/features/calendar/Calendar";
import { fetchCalendars } from "@/lib/supabase/calendars";
import { fetchStocksData } from "@/lib/supabase/stocks";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserPermissions, PERM } from "@/lib/permissions";
import { accessibleModules } from "@/lib/modules";
import Stocks from "@/features/stocks/Stocks";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Header />
        <div className="fixed inset-0 top-12 flex items-center justify-center">
          <Image src="/assets/logo.svg" alt="daam.pl" width={64} height={64} className="opacity-10" priority />
        </div>
      </>
    );
  }

  const perms = await getCurrentUserPermissions();

  if (!perms.has(PERM.VIEW_DASHBOARD)) {
    return (
      <>
        <Header />
        <ModuleList modules={accessibleModules(perms)} />
      </>
    );
  }

  const [calendars, stocks] = await Promise.all([fetchCalendars(), fetchStocksData()]);

  return (
    <>
      <Header />
      <Grid>
        <Stocks sets={stocks.sets} />
        <Calendar calendars={calendars} />
      </Grid>
    </>
  );
}
