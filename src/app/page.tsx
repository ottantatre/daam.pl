import Image from "next/image";
import { Header, Grid } from "@/components";
import Calendar from "@/features/calendar/Calendar";
import { fetchCalendars } from "@/lib/supabase/calendars";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const calendars = user ? await fetchCalendars() : [];

  return (
    <>
      <Header />
      {user ? (
        <Grid>
          <Calendar calendars={calendars} />
        </Grid>
      ) : (
        <div className="fixed inset-0 top-12 flex items-center justify-center">
          <Image src="/assets/logo.svg" alt="daam.pl" width={64} height={64} className="opacity-10" priority />
        </div>
      )}
    </>
  );
}
