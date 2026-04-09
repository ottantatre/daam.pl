"use client";

import { useEffect, useState } from "react";

const CELL = 80;
const HEADER = 48;

export function Grid({ children }: { children?: React.ReactNode }) {
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    function update() {
      setCols(Math.floor(window.innerWidth / CELL));
      setRows(Math.floor((window.innerHeight - HEADER) / CELL));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!cols || !rows) return null;

  return (
    <main
      className="fixed inset-0 top-12"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {children}
    </main>
  );
}
