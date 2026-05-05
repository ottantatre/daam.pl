"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { useAsyncRefresh } from "@/lib/useAsyncRefresh";
import { canAdd, UserCalendar } from "./types";
import { formatDateISO, isDateTimePast } from "./calendarUtils";
import { CalendarSelect } from "./CalendarSelect";

type Props = {
  onClose: () => void;
  calendars: UserCalendar[];
  defaultDate: Date;
};

function defaultTimes(date: Date): { start: string; end: string } {
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (!sameDay || now.getHours() < 9) return { start: "09:00", end: "10:00" };
  const nextHour = Math.min(now.getHours() + 1, 22);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { start: `${pad(nextHour)}:00`, end: `${pad(Math.min(nextHour + 1, 23))}:00` };
}

export function NewEventModal({ onClose, calendars, defaultDate }: Props) {
  const addable = useMemo(() => calendars.filter((c) => canAdd(c.role)), [calendars]);
  const todayISO = useMemo(() => formatDateISO(new Date()), []);
  const initialTimes = useMemo(() => defaultTimes(defaultDate), [defaultDate]);

  const [calendarId, setCalendarId] = useState(addable[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(formatDateISO(defaultDate));
  const [start, setStart] = useState(initialTimes.start);
  const [end, setEnd] = useState(initialTimes.end);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPending, refresh } = useAsyncRefresh(onClose);

  const busy = fetching || isPending;
  const startInPast = isDateTimePast(date, start);
  const endBeforeStart = end <= start;
  const disabled = !title.trim() || !calendarId || startInPast || endBeforeStart || busy;

  const handleCreate = async () => {
    if (disabled) return;
    setFetching(true);
    setError(null);
    const res = await fetch(`/api/calendars/${calendarId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), date, start, end }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Request failed" }));
      setError(body.error ?? "Request failed");
      setFetching(false);
      return;
    }
    setFetching(false);
    refresh();
  };

  if (addable.length === 0) {
    return (
      <Modal onClose={onClose}>
        <span className="text-zinc-500 uppercase tracking-wider text-extrasmall">Nowe wydarzenie</span>
        <span className="text-zinc-600">Brak kalendarza, do którego możesz dodać wydarzenie.</span>
        <div className="flex justify-end">
          <button className="text-zinc-400 hover:text-zinc-600 cursor-pointer" onClick={onClose}>
            zamknij
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <span className="text-zinc-500 uppercase tracking-wider text-extrasmall">Nowe wydarzenie</span>

      <CalendarSelect calendars={addable} value={calendarId} onChange={setCalendarId} />

      <input
        className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none placeholder:text-zinc-400"
        placeholder="tytuł"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        autoComplete="off"
        autoFocus
      />

      <input
        type="date"
        className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none"
        value={date}
        min={todayISO}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="flex gap-2">
        <input
          type="time"
          className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none flex-1"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="time"
          className="bg-zinc-200 px-2 py-1 text-zinc-800 outline-none flex-1"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      {startInPast && <span className="text-red-500 text-extrasmall">Nie można tworzyć wydarzeń w przeszłości</span>}
      {!startInPast && endBeforeStart && <span className="text-red-500 text-extrasmall">Koniec musi być po początku</span>}
      {error && <span className="text-red-500 text-extrasmall">{error}</span>}

      <div className="flex gap-2 justify-end">
        <button className="text-zinc-400 hover:text-zinc-600 cursor-pointer" disabled={busy} onClick={onClose}>
          anuluj
        </button>
        <button
          className="text-zinc-700 hover:text-zinc-900 cursor-pointer disabled:opacity-40"
          disabled={disabled}
          onClick={handleCreate}
        >
          utwórz
        </button>
      </div>
    </Modal>
  );
}
