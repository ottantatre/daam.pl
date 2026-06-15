#!/usr/bin/env bash
# PostToolUse (Edit|Write) hook: nudge to refresh the privacy policy when a
# privacy-relevant source file changes. Stays silent for everything else.

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -n "$file" ] || exit 0

# Skip the policy itself, its renderer, and the skill (avoid self-triggering).
case "$file" in
  */src/content/privacy.ts | */components/PrivacyPolicy.tsx | */update-privacy-policy/*) exit 0 ;;
esac

# Only watch the site source.
case "$file" in
  */src/* | */public/*) ;;
  *) exit 0 ;;
esac

[ -f "$file" ] || exit 0

# High-signal markers that the site may now process personal data.
signals='cookie|localStorage|sessionStorage|analytics|gtag|plausible|posthog|mixpanel|segment|hotjar|fbq|tracking|<script|<iframe|<form|<input|<textarea|onSubmit|supabase|next-auth|getServerSession|signIn|googleapis|gstatic|fonts\.google'

if grep -qiE "$signals" "$file"; then
  msg="⚠️ Privacy-relevant change in ${file##*/}. The site may now process data differently — run /update-privacy-policy to review and refresh src/content/privacy.ts (pl/en/it)."
  jq -cn --arg m "$msg" '{systemMessage: $m, suppressOutput: true}'
fi
exit 0
