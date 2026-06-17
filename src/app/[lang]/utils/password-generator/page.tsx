import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PasswordGenerator } from "@/components/PasswordGenerator";
import { isLocale } from "@/lib/i18n";
import { utilsContent } from "@/content/utils";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: `${utilsContent[lang].tools["password-generator"].name} — daam.pl` };
}

export default async function PasswordGeneratorPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = utilsContent[lang];

  return (
    <div className="w-full max-w-md self-center">
      <Link
        href={`/${lang}/utils`}
        className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 transition-colors hover:text-zinc-300"
      >
        ← {content.title}
      </Link>
      <h1 className="mt-4 text-base font-medium uppercase tracking-[0.2em] text-zinc-100">
        {content.tools["password-generator"].name}
      </h1>

      <PasswordGenerator labels={content.passwordGenerator} />
    </div>
  );
}
