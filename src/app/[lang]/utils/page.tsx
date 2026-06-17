import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { utilsTools } from "@/lib/utils-tools";
import { utilsContent } from "@/content/utils";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: `${utilsContent[lang].title} — daam.pl` };
}

export default async function UtilsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = utilsContent[lang];

  return (
    <div className="w-full max-w-prose self-center">
      <h1 className="text-base font-medium uppercase tracking-[0.2em] text-zinc-100">
        {content.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500">{content.intro}</p>

      <ul className="mt-8">
        {utilsTools.map((slug) => (
          <li key={slug}>
            <Link
              href={`/${lang}/utils/${slug}`}
              className="group flex flex-col gap-1 border-t border-zinc-800 py-5 transition-colors hover:border-zinc-600"
            >
              <span className="text-sm uppercase tracking-[0.18em] text-zinc-200 transition-colors group-hover:text-zinc-100">
                {content.tools[slug].name}
              </span>
              <span className="text-sm text-zinc-500">
                {content.tools[slug].description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
