import type { Locale } from "@/lib/i18n";
import type { PrivacyContent } from "@/content/privacy";

const dateLocale: Record<Locale, string> = {
  pl: "pl-PL",
  en: "en-GB",
  it: "it-IT",
};

const updatedLabel: Record<Locale, string> = {
  pl: "Ostatnia aktualizacja",
  en: "Last updated",
  it: "Ultimo aggiornamento",
};

export function PrivacyPolicy({
  locale,
  content,
}: {
  locale: Locale;
  content: PrivacyContent;
}) {
  const updated = new Intl.DateTimeFormat(dateLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${content.updated}T00:00:00Z`));

  return (
    <article className="w-full max-w-prose self-center py-6 text-left">
      <h1 className="text-base font-medium uppercase tracking-[0.2em] text-zinc-100">
        {content.title}
      </h1>
      <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-zinc-600">
        {updatedLabel[locale]}: {updated}
      </p>
      <p className="mt-6 text-sm leading-relaxed text-zinc-400">{content.intro}</p>

      <div className="mt-8 flex flex-col gap-7">
        {content.sections.map((section, i) => (
          <section key={i} className="flex flex-col gap-2">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-200">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, j) => (
              <p key={j} className="text-sm leading-relaxed text-zinc-400">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
