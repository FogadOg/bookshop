"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoggInnPage() {
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
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="card bg-white shadow-md w-full max-w-sm">
        <div className="card-body">
          <h1 className="text-2xl font-bold mb-4">Admin logg inn</h1>
          {error && <div className="alert alert-error text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label"><span className="label-text">E-post</span></label>
              <input name="email" type="email" required className="input input-bordered w-full" />
            </div>
            <div>
              <label className="label"><span className="label-text">Passord</span></label>
              <input name="password" type="password" required className="input input-bordered w-full" />
            </div>
            <button type="submit" disabled={isPending} className="btn btn-neutral w-full">
              {isPending ? "Logger inn..." : "Logg inn"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
