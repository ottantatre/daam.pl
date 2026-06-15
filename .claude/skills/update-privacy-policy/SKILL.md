---
name: update-privacy-policy
description: Audit the site for data-processing changes and update the privacy policy in src/content/privacy.ts (pl/en/it) when warranted. Use after the site gains or loses anything that touches personal data — cookies, localStorage/sessionStorage, analytics or tag managers, tracking pixels, contact/registration/newsletter forms, authentication or accounts, third-party scripts or embeds (maps, video, social), externally-hosted fonts, new third-party API integrations, or a change of hosting provider / sub-processor.
---

# Update privacy policy

The privacy policy for the daam.pl landing lives in `src/content/privacy.ts` as a typed
`Record<Locale, PrivacyContent>` (`pl`/`en`/`it`), rendered by
`src/components/PrivacyPolicy.tsx` on the localized privacy route
(`/[lang]/<privacy-slug>`, slugs in `src/lib/routes.ts`). This skill keeps that policy
truthful when the site changes.

## When to run

Run after any change that alters how visitor data is processed, e.g.:

- Cookies / `localStorage` / `sessionStorage`, or `document.cookie`
- Analytics or tag managers (Google Analytics, Plausible, PostHog, Vercel Analytics, …)
- Tracking pixels, ad / marketing scripts
- Contact, newsletter, or registration forms — anything a visitor submits that is stored or sent
- Authentication / accounts / Supabase or any backend that stores personal data
- Third-party embeds (maps, video, social, comments) or external `<script>` tags
- Fonts or assets loaded from a third party instead of self-hosted
- New API calls to third-party services that receive visitor data
- A change of hosting provider or sub-processor

Cosmetic or content-only changes (copy, layout, colours, a new informational subpage that
collects nothing) do **not** require an update.

## Steps

1. **Inventory the current site.** Search for privacy-relevant signals (adjust patterns as needed):
   - `grep -rinE "cookies?|localstorage|sessionstorage|document\.cookie" src`
   - `grep -rinE "analytics|gtag|plausible|posthog|mixpanel|segment|hotjar|pixel|fbq" src package.json`
   - `grep -rinE "<form|onsubmit|<input|<textarea|fetch\(|action=" src`
   - `grep -rinE "supabase|auth|sign-?in|login|session|jwt" src`
   - `grep -rinE "<script|<iframe|googleapis|gstatic|cdn\." src public`
   - Confirm fonts: `next/font` self-hosts (no external font requests) — flag any switch to a CDN font.
   - Scan `package.json` for SDKs that process personal data.
2. **Compare** the findings against what each locale in `src/content/privacy.ts` currently declares
   (cookies, analytics, fonts, forms, recipients/processors, transfers, legal basis, retention, rights).
3. **Decide** whether a material change exists. If not, stop and report "no update needed".
4. **Edit `src/content/privacy.ts`** when warranted:
   - Update the affected section(s) in **all three locales** — keep them semantically identical and in the same order.
   - Add a new section when a new processing activity appears (e.g. a "Cookies" or "Analytics" section describing purpose, legal basis, retention, and how to opt out).
   - When a new processor/recipient appears, update the "recipients / hosting" and "transfers outside the EEA" sections and name it.
   - Re-check the legal basis: non-essential cookies/analytics/marketing need **consent** (Art. 6(1)(a) GDPR) and usually a consent banner; security logs rely on **legitimate interest** (Art. 6(1)(f)).
   - **Bump `updated`** to today's date (ISO `YYYY-MM-DD`) for every locale you changed.
5. **Verify**: run `npm run build`; confirm the privacy page renders for each locale
   (`/pl/polityka-prywatnosci`, `/en/privacy-policy`, `/it/informativa-privacy`).
6. **Report** a concise summary of what changed and why, and flag anything needing the owner's input.

## Guardrails

- Keep the three languages in sync — never update one locale only.
- Describe only what the site actually does; do not invent processors, transfers, or data flows.
- Leave owner placeholders intact unless given real values: controller legal name
  (`[imię i nazwisko / nazwa administratora]` / `[controller name]` / `[nome del titolare]`)
  and the contact email.
- This is a template, not legal advice. Flag to the owner that material changes — especially adding
  consent-based processing (analytics, cookies, marketing) — should be reviewed by a qualified person
  and may require a cookie-consent mechanism.
