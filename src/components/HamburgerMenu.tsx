"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="h-full flex flex-col items-center justify-center" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex items-center justify-center w-8 h-8 cursor-pointer text-zinc-900"
      >
        {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
      </button>

      <div className="absolute w-full bottom-0 left-0">
        {open && (
          <div className="absolute left-0 top-0 w-full h-[calc(100vh-3rem)] backdrop-blur-xs">
            <div className="flex flex-col items-start gap-1 bg-zinc-50 w-full px-2">
              {loggedIn ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-left px-4 py-3 text-xs tracking-widest uppercase text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Sign out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-xs tracking-widest uppercase text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    <LogIn size={14} strokeWidth={1.5} />
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
