import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";

type Props = {
  lang: Locale;
  nav: { about: string; offer: string };
};

export function Header({ lang, nav }: Props) {
  return (
    <header className="grid grid-cols-[1fr_40px_1fr] items-center p-6 pb-8 text-[11px] uppercase tracking-[0.25em] text-zinc-400">
      <div className="flex justify-end pr-8">
        <Link
          href={pageHref(lang, "about")}
          className="transition-colors hover:text-zinc-100"
        >
          {nav.about}
        </Link>
      </div>

      <div className="flex justify-center">
        <Link
          href={`/${lang}`}
          aria-label="daam.pl"
          className="transition-opacity hover:opacity-70"
        >
          <Image
            src="/logo_white_transparent.svg"
            alt=""
            width={32}
            height={32}
            priority
          />
        </Link>
      </div>

      <div className="flex justify-start pl-8">
        <Link
          href={pageHref(lang, "offer")}
          className="transition-colors hover:text-zinc-100"
        >
          {nav.offer}
        </Link>
      </div>
    </header>
  );
}
