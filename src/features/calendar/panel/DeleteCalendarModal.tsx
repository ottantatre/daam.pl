"use client";

import { useAsyncRefresh } from "@/lib/useAsyncRefresh";
import { useState } from "react";
import { UserCalendar } from "../types";
import { Modal } from "@/components/Modal";

export function DeleteCalendarModal({ calendar, onClose }: { calendar: UserCalendar; onClose: () => void }) {
  const [fetching, setFetching] = useState(false);
  const { isPending, refresh } = useAsyncRefresh(onClose);

  const busy = fetching || isPending;

  const handleDelete = async () => {
    setFetching(true);
    await fetch(`/api/calendars/${calendar.id}`, { method: "DELETE" });
    setFetching(false);
    refresh();
  };

  return (
    <Modal onClose={onClose}>
      <span className="text-zinc-500 uppercase tracking-wider text-extrasmall">Usuń kalendarz</span>
      <p className="text-zinc-600">
        Usunąć <span className="text-zinc-800">{calendar.name}</span>? Tej operacji nie można cofnąć.
      </p>
      <div className="flex gap-2 justify-end">
        <button className="text-zinc-400 hover:text-zinc-600 cursor-pointer" disabled={busy} onClick={onClose}>
          anuluj
        </button>
        <button
          className="text-red-400 hover:text-red-600 cursor-pointer disabled:opacity-40"
          disabled={busy}
          onClick={handleDelete}
        >
          usuń
        </button>
      </div>
    </Modal>
  );
}
