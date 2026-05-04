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
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Bokhandelen</h1>
          <p className="text-gray-400 text-sm mt-1">Admin</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          {error && (
            <div className="alert alert-error mb-4 text-sm py-2">
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label pt-0"><span className="label-text font-medium">E-post</span></label>
              <input name="email" type="email" required className="input input-bordered w-full" placeholder="admin@bokhandelen.no" />
            </div>
            <div>
              <label className="label pt-0"><span className="label-text font-medium">Passord</span></label>
              <input name="password" type="password" required className="input input-bordered w-full" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={isPending} className="btn btn-neutral w-full mt-2">
              {isPending ? <><span className="loading loading-spinner loading-sm" /> Logger inn...</> : "Logg inn"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
