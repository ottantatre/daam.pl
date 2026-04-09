"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — form */}
      <div className="flex flex-1 flex-col justify-between p-12 bg-white">
        <span className="text-xs tracking-widest uppercase text-zinc-400">daam.pl</span>

        <form onSubmit={handleSubmit} noValidate className="w-full max-w-xs space-y-10">
          <div className="space-y-1">
            <h1 className="text-sm font-medium tracking-tight">Sign in</h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-px">
              <label htmlFor="email" className="block text-[11px] uppercase tracking-widest text-zinc-400 mb-2">
                email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full border-b border-zinc-200 bg-transparent py-2 text-sm outline-none transition-colors focus:border-zinc-900 placeholder:text-zinc-300"
              />
            </div>

            <div className="space-y-px">
              <label htmlFor="password" className="block text-[11px] uppercase tracking-widest text-zinc-400 mb-2">
                password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full border-b border-zinc-200 bg-transparent py-2 text-sm outline-none transition-colors focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="space-y-3">
            {error && <p className="text-[11px] text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="text-sm font-medium tracking-wide underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-900 transition-colors disabled:opacity-30 cursor-pointer"
            >
              {loading ? "..." : "Sign in →"}
            </button>
          </div>
        </form>

        <span className="text-[11px] text-zinc-300">© {new Date().getFullYear()}</span>
      </div>

      {/* Right — logo panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-zinc-50">
        <Image src="/assets/logo.svg" alt="daam.pl" width={64} height={64} priority className="opacity-10" />
      </div>
    </div>
  );
}
