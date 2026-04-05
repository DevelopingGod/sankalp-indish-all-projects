"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const emailRaw = String(fd.get("email") ?? "");
    const passwordRaw = String(fd.get("password") ?? "");
    const emailTrimmed = emailRaw.trim();
    const passwordValue = passwordRaw;

    setEmail(emailTrimmed);
    setPassword(passwordValue);

    if (!emailTrimmed || !passwordValue) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting payload:", {
        email: emailTrimmed,
        password: passwordValue,
      });
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password: passwordValue,
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      <div>
        <label
          htmlFor="admin-email"
          className="mb-1 block text-sm font-semibold text-[#495057]"
        >
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-[#ced4da] bg-white px-3 py-2.5 text-[#212529] outline-none focus:border-[#86b7fe] focus:ring-2 focus:ring-[#0d6efd]/25"
        />
      </div>
      <div>
        <label
          htmlFor="admin-password"
          className="mb-1 block text-sm font-semibold text-[#495057]"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-[#ced4da] bg-white px-3 py-2.5 text-[#212529] outline-none focus:border-[#86b7fe] focus:ring-2 focus:ring-[#0d6efd]/25"
        />
      </div>
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0d6efd] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0b5ed7] disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
