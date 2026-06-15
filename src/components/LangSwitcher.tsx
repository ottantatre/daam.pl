"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n";
import { pageKeyForSlug, slugs } from "@/lib/routes";

export function LangSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const currentSlug = pathname.split("/").filter(Boolean)[1];

  const hrefFor = (target: Locale) => {
    if (!currentSlug) return `/${target}`;
    // Translate the localized slug into the target locale's equivalent.
    const key = pageKeyForSlug(current, currentSlug);
    return key ? `/${target}/${slugs[key][target]}` : `/${target}`;
  };

  return (
    <div className="flex items-center gap-3">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={hrefFor(locale)}
          aria-current={locale === current ? "true" : undefined}
          className={
            locale === current
              ? "text-zinc-200"
              : "text-zinc-600 transition-colors hover:text-zinc-300"
          }
        >
          {localeNames[locale]}
        </Link>
      ))}
    </div>
  );
}
