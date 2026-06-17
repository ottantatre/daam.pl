import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { utilsContent } from "@/content/utils";

const S: Record<Locale, { free: string; paid: string; comingSoon: string }> = {
  pl: { free: "Darmowe", paid: "Płatne", comingSoon: "Wkrótce." },
  en: { free: "Free", paid: "Paid", comingSoon: "Coming soon." },
  it: { free: "Gratis", paid: "A pagamento", comingSoon: "Presto." },
};

const sectionLabel = "text-[10px] uppercase tracking-[0.25em] text-zinc-500";

export function Products({ lang, title }: { lang: Locale; title: string }) {
  const t = S[lang];
  const utils = utilsContent[lang];

  return (
    <div className="w-full max-w-prose self-center">
      <h1 className="text-base font-medium uppercase tracking-[0.2em] text-zinc-100">
        {title}
      </h1>

      <div className="mt-10 flex flex-col gap-12">
        <section>
          <h2 className={sectionLabel}>{t.free}</h2>
          <ul className="mt-4">
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
        </section>

        <section>
          <h2 className={sectionLabel}>{t.paid}</h2>
          <p className="mt-4 border-t border-zinc-800 py-5 text-sm text-zinc-600">
            {t.comingSoon}
          </p>
        </section>
      </div>
    </div>
  );
}
