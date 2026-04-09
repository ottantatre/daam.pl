import { cn } from "@/lib/cn";

interface CalendarCardProps {
  children: React.ReactNode;
  className?: string;
}

export function CalendarCard({ children, className }: CalendarCardProps) {
  return <div className={cn("flex flex-col p-2 bg-zinc-100 basis-full", className)}>{children}</div>;
}
