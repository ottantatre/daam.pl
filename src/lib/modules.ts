import { PERM, PermissionKey } from "./permissions";

export type Module = {
  key: PermissionKey;
  name: string;
  path: string;
};

// Module registry. Entries here drive the module-list shown to users
// without dashboard permission. Add a new module = register here.
export const MODULES: Module[] = [
  { key: PERM.VIEW_DASHBOARD, name: "Dashboard", path: "/" },
  { key: PERM.VIEW_MEALS, name: "Meals", path: "/meals" },
];

export function accessibleModules(perms: Set<string>): Module[] {
  return MODULES.filter((m) => perms.has(m.key));
}
