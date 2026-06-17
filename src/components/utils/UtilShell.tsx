import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { utilsContent } from "@/content/utils";

export function UtilShell({
  lang,
  title,
  children,
}: {
  lang: Locale;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md self-center">
      <Link
        href={`/${lang}/utils`}
        className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 transition-colors hover:text-zinc-300"
      >
        ← {utilsContent[lang].title}
      </Link>
      <h1 className="mt-4 text-base font-medium uppercase tracking-[0.2em] text-zinc-100">
        {title}
      </h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}
