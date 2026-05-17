import { cn } from "@/lib/utils";

export function StockCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col p-2 bg-zinc-200 basis-full", className)}>{children}</div>;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="uppercase tracking-widest text-extrasmall text-zinc-500">{children}</span>;
}
