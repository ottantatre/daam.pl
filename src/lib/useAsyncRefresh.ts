"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";

export function useAsyncRefresh(onDone: () => void) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current && !isPending) {
      triggered.current = false;
      onDone();
    }
  }, [isPending, onDone]);

  return {
    isPending,
    refresh: () => {
      triggered.current = true;
      startTransition(() => router.refresh());
    },
  };
}
