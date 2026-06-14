import Link from "next/link";
import { Module } from "@/lib/modules";

export function ModuleList({ modules }: { modules: Module[] }) {
  if (modules.length === 0) {
    return (
      <div className="fixed inset-0 top-12 flex items-center justify-center">
        <span className="text-zinc-400 text-small uppercase tracking-widest">brak dostępu</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-12 flex items-center justify-center">
      <div className="flex flex-col gap-3">
        <span className="text-zinc-400 text-extrasmall uppercase tracking-widest">moduły</span>
        <ul className="flex flex-col gap-1">
          {modules.map((m) => (
            <li key={m.key}>
              <Link
                href={m.path}
                className="text-zinc-700 hover:text-zinc-900 hover:underline text-medium cursor-pointer"
              >
                {m.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
