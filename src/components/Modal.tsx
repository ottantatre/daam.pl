"use client";

import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  const target = document.getElementById("modals");
  if (!target) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-zinc-100 p-4 flex flex-col gap-3 min-w-50 text-small" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    target,
  );
}
