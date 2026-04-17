"use client";

import { useAsyncRefresh } from "@/lib/useAsyncRefresh";
import { useState } from "react";
import { UserCalendar } from "../types";
import { Modal } from "@/components/Modal";
import { ColorPicker } from "./ColorPicker";

export function EditCalendarModal({
  calendar,
  onClose,
  usedColors = [],
}: {
  calendar: UserCalendar;
  onClose: () => void;
  usedColors?: string[];
}) {
  const [name, setName] = useState(calendar.name);
  const [color, setColor] = useState(calendar.color);
  const [fetching, setFetching] = useState(false);
  const { isPending, refresh } = useAsyncRefresh(onClose);

  const busy = fetching || isPending;

  const handleSave = async () => {
    if (!name.trim()) return;
    setFetching(true);
    await fetch(`/api/calendars/${calendar.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), color }),
    });
    setFetching(false);
    refresh();
  };

  return (
    <Modal onClose={onClose}>
      <span className="text-zinc-500 uppercase tracking-wider text-extrasmall">Edytuj kalendarz</span>
      <input
        className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none placeholder:text-zinc-400"
        placeholder="nazwa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        autoComplete="off"
        autoFocus
      />
      <ColorPicker value={color} onChange={setColor} disabled={usedColors.filter((c) => c !== calendar.color)} />
      <div className="flex gap-2 justify-end">
        <button className="text-zinc-400 hover:text-zinc-600 cursor-pointer" disabled={busy} onClick={onClose}>
          anuluj
        </button>
        <button
          className="text-zinc-700 hover:text-zinc-900 cursor-pointer disabled:opacity-40"
          disabled={!name.trim() || busy}
          onClick={handleSave}
        >
          zapisz
        </button>
      </div>
    </Modal>
  );
}
