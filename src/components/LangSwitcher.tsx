"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n";
import { pageKeyForSlug, slugs } from "@/lib/routes";

export function LangSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const rest = pathname.split("/").filter(Boolean).slice(1); // path after the locale

  const hrefFor = (target: Locale) => {
    if (rest.length === 0) return `/${target}`;
    // A single localized page slug → translate it to the target locale.
    if (rest.length === 1) {
      const key = pageKeyForSlug(current, rest[0]);
      if (key) return `/${target}/${slugs[key][target]}`;
    }
    // Fixed routes (e.g. /utils/...) keep their path; just swap the locale.
    return `/${target}/${rest.join("/")}`;
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
