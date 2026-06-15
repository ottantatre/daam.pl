import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContent } from "@/components/PageContent";
import { PrivacyPolicy } from "@/components/PrivacyPolicy";
import { privacyPolicy } from "@/content/privacy";
import { isLocale } from "@/lib/i18n";
import { pageKeyForSlug, pageKeys, slugs } from "@/lib/routes";
import { getDictionary } from "../dictionaries";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!isLocale(lang)) return [];
  return pageKeys.map((key) => ({ slug: slugs[key][lang] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const key = pageKeyForSlug(lang, slug);
  if (!key) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.pages[key].title} — daam.pl` };
}

export default async function ContentPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const key = pageKeyForSlug(lang, slug);
  if (!key) notFound();

  if (key === "privacy") {
    return <PrivacyPolicy locale={lang} content={privacyPolicy[lang]} />;
  }

  const dict = await getDictionary(lang);
  return <PageContent title={dict.pages[key].title} body={dict.pages[key].body} />;
}
