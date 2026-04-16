"use client";

import { cn } from "@/lib/cn";
import { CalendarArrowUp, CalendarCog, CalendarX2 } from "lucide-react";
import { createPortal } from "react-dom";

interface Props {
  top: number;
  left: number;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function CalendarContextMenu({ top, left, onShare, onEdit, onDelete, onClose }: Props) {
  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      <div
        className="fixed z-50 bg-zinc-100 p-1 flex gap-1 shadow-sm"
        style={{ top, left }}
      >
        <Item
          icon={CalendarArrowUp}
          onClick={() => {
            onShare();
            onClose();
          }}
        />
        <Item
          icon={CalendarCog}
          onClick={() => {
            onEdit();
            onClose();
          }}
        />
        <div className="border-l border-zinc-200" />
        <Item
          icon={CalendarX2}
          onClick={() => {
            onDelete();
            onClose();
          }}
          danger
        />
      </div>
    </>,
    document.body,
  );
}

function Item({
  icon: Icon,
  onClick,
  danger,
}: {
  icon: React.FC<{ size?: number; strokeWidth?: number }>;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-1.5 p-1 cursor-pointer hover:bg-zinc-200",
        danger ? "text-red-400 hover:text-red-600" : "text-zinc-600 hover:text-zinc-800",
      )}
      onClick={onClick}
    >
      <Icon size={16} strokeWidth={1.5} />
    </button>
  );
}
