import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UtilShell } from "@/components/utils/UtilShell";
import { toolComponents } from "@/components/utils/registry";
import { isLocale } from "@/lib/i18n";
import { utilsTools, type UtilSlug } from "@/lib/utils-tools";
import { utilsContent } from "@/content/utils";

type Props = { params: Promise<{ lang: string; tool: string }> };

function isTool(value: string): value is UtilSlug {
  return (utilsTools as readonly string[]).includes(value);
}

export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) return [];
  return utilsTools.map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, tool } = await params;
  if (!isLocale(lang) || !isTool(tool)) return {};
  return { title: `${utilsContent[lang].tools[tool].name} — daam.pl` };
}

export default async function ToolPage({ params }: Props) {
  const { lang, tool } = await params;
  if (!isLocale(lang) || !isTool(tool)) notFound();

  const Tool = toolComponents[tool];

  return (
    <UtilShell lang={lang} title={utilsContent[lang].tools[tool].name}>
      <Tool locale={lang} />
    </UtilShell>
  );
}
