"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);
    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setIsPending(false);

    if (result?.error) {
      setError("Feil e-post eller passord");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">Admin</p>
          <h1 className="text-3xl font-semibold tracking-tight">Bokhandelen</h1>
        </div>
        {error && (
          <div className="bg-accent-soft text-accent text-sm py-2.5 px-4 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-sm text-[var(--foreground)] mb-1.5 block">E-post</span>
            <input name="email" type="email" required className="input-clean" placeholder="admin@bokhandelen.no" />
          </label>
          <label className="block">
            <span className="text-sm text-[var(--foreground)] mb-1.5 block">Passord</span>
            <input name="password" type="password" required className="input-clean" placeholder="••••••••" />
          </label>
          <button
            type="submit"
            disabled={isPending}
            className="btn-accent w-full py-2.5 rounded text-sm font-medium mt-2"
          >
            {isPending ? "Logger inn..." : "Logg inn"}
          </button>
        </form>
      </div>
    </main>
  );
}
