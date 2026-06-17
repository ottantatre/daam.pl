import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { utilsContent } from "@/content/utils";

export function Offer({ lang, title }: { lang: Locale; title: string }) {
  const utils = utilsContent[lang];

  return (
    <div className="w-full max-w-prose self-center">
      <h1 className="text-base font-medium uppercase tracking-[0.2em] text-zinc-100">
        {title}
      </h1>

      <ul className="mt-8">
        <li>
          <Link
            href={`/${lang}/utils`}
            className="group flex flex-col gap-1 border-t border-zinc-800 py-5 transition-colors hover:border-zinc-600"
          >
            <span className="text-sm uppercase tracking-[0.18em] text-zinc-200 transition-colors group-hover:text-zinc-100">
              {utils.title}
            </span>
            <span className="text-sm text-zinc-500">{utils.intro}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
