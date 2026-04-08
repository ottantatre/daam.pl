import Image from "next/image";
import HamburgerMenu from "@/components/HamburgerMenu";
import Grid from "@/components/Grid";
import Calendar from "@/features/calendar/Calendar";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 h-12 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-900">
        <HamburgerMenu />
      </header>
      {user ? (
        <Grid>
          <Calendar />
        </Grid>
      ) : (
        <div className="fixed inset-0 top-12 flex items-center justify-center">
          <Image
            src="/assets/logo.svg"
            alt="daam.pl"
            width={64}
            height={64}
            className="opacity-10 dark:invert"
            priority
          />
        </div>
      )}
    </>
  );
}
