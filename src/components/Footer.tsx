import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { LangSwitcher } from "./LangSwitcher";

type Props = {
  lang: Locale;
  privacy: string;
  year: number;
};

export function Footer({ lang, privacy, year }: Props) {
  return (
    <footer className="flex flex-col items-center gap-4 p-6 pt-8 text-[10px] uppercase tracking-[0.25em] text-zinc-600">
      <LangSwitcher current={lang} />

      <div className="flex items-center gap-2.5">
        <span>{year}</span>
        <span aria-hidden>·</span>
        <Link
          href={pageHref(lang, "privacy")}
          className="transition-colors hover:text-zinc-300"
        >
          {privacy}
        </Link>
      </div>
    </footer>
  );
}
