// Registry of micro-utils available under /[lang]/utils.
// Slugs are fixed (technical) across all locales; names/descriptions are localized
// in src/content/utils.ts. Add a slug here + matching content + a page folder.
export const utilsTools = ["password-generator"] as const;

export type UtilSlug = (typeof utilsTools)[number];
