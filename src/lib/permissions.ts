import "server-only";
import { createClient } from "./supabase/server";

export const PERM = {
  VIEW_DASHBOARD: "view:dashboard",
  VIEW_MEALS: "view:meals",
} as const;

export type PermissionKey = (typeof PERM)[keyof typeof PERM];

export async function getCurrentUserPermissions(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase.from("user_permissions").select("permission").eq("user_id", user.id);
  return new Set((data ?? []).map((r) => r.permission));
}

export async function hasPermission(perm: PermissionKey | string): Promise<boolean> {
  const perms = await getCurrentUserPermissions();
  return perms.has(perm);
}
