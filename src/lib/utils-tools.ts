// Registry of micro-utils available under /[lang]/utils/[tool].
// Slugs are fixed (technical) across all locales. The hub listing order follows
// this array. To add a tool: add a slug here + content in src/content/utils.ts
// + a client component in src/components/utils/ wired in registry.ts.
export const utilsTools = [
  "password-generator",
  "uuid",
  "hash",
  "base64",
  "url-encode",
  "json",
  "jwt",
  "color",
  "timestamp",
  "case",
  "text-stats",
  "lorem",
] as const;

export type UtilSlug = (typeof utilsTools)[number];
