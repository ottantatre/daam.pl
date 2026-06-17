import { headers } from "next/headers";
import Link from "next/link";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

const NF: Record<Locale, { message: string; home: string }> = {
  pl: { message: "Ta strona nie istnieje.", home: "Strona główna" },
  en: { message: "This page does not exist.", home: "Home" },
  it: { message: "Questa pagina non esiste.", home: "Home" },
};

export default async function NotFound() {
  const segment = (await headers()).get("x-pathname")?.split("/")[1] ?? "";
  const lang: Locale = isLocale(segment) ? segment : defaultLocale;
  const t = NF[lang];

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="text-4xl font-medium tracking-tight text-zinc-100">404</p>
      <span aria-hidden className="h-px w-8 bg-zinc-700" />
      <p className="text-sm text-zinc-500">{t.message}</p>
      <Link
        href={`/${lang}`}
        className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 underline underline-offset-4 transition-colors hover:text-zinc-100"
      >
        {t.home}
      </Link>
    </div>
  );
}
