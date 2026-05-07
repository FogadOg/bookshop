import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../../auth";
import CreateBookForm from "./CreateBookForm";

export const metadata: Metadata = { title: "Ny bok – Admin | Bokhandelen" };

export const dynamic = "force-dynamic";

export default async function NewBookPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <main className="w-full sm:max-w-2xl sm:mx-auto px-4 sm:px-8 py-12 sm:py-14">
      <Link
        href="/admin"
        className="text-sm text-muted hover:text-accent transition-colors mb-6 inline-flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 9.5L4 6L7.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Tilbake
      </Link>
      <div className="mb-10 pb-6 border-b border-soft">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">Admin</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Ny bok</h1>
      </div>
      <CreateBookForm />
    </main>
  );
}
