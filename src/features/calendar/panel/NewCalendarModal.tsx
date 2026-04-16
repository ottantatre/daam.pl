import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PRESET_COLORS = ["#71717a", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7"];

export function NewCalendarModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[5]);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    await supabase.from("calendars").insert({ name: name.trim(), color, user_id: user.id });
    router.refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-zinc-100 p-4 flex flex-col gap-3 min-w-50 text-small" onClick={(e) => e.stopPropagation()}>
        <span className="text-zinc-500 uppercase tracking-wider text-extrasmall">Nowy kalendarz</span>
        <input
          className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none placeholder:text-zinc-400"
          placeholder="nazwa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          autoComplete="off"
          autoFocus
        />
        <div className="flex gap-1 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              className={cn("w-3.5 h-3.5 cursor-pointer", {
                "ring-1 ring-offset-1 ring-zinc-500": color === c,
              })}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button className="text-zinc-400 hover:text-zinc-600 cursor-pointer" onClick={onClose}>
            anuluj
          </button>
          <button
            className="text-zinc-700 hover:text-zinc-900 cursor-pointer disabled:opacity-40"
            disabled={!name.trim() || loading}
            onClick={handleCreate}
          >
            utwórz
          </button>
        </div>
      </div>
    </div>
  );
}
