import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { createDiscountCode, toggleDiscountCode, deleteDiscountCode } from "./actions";

export const dynamic = "force-dynamic";

export default async function DiscountCodesPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const codes = await prisma.discountCode.findMany({ orderBy: { code: "asc" } });

  return (
    <main className="w-full sm:max-w-3xl sm:mx-auto px-4 sm:px-8 py-12 sm:py-14">
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
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Rabattkoder</h1>
        <p className="text-muted mt-1">{codes.length} koder totalt</p>
      </div>

      <div className="border border-soft rounded-md p-6 mb-10 bg-surface">
        <h2 className="text-sm uppercase tracking-wider text-muted mb-4">Ny rabattkode</h2>
        <form action={createDiscountCode} className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="block text-sm text-[var(--foreground)] mb-1.5">Kode</label>
            <input
              name="code"
              required
              className="input-clean"
              placeholder="F.eks. BOKHANDEL10"
            />
          </div>
          <div className="sm:w-28">
            <label className="block text-sm text-[var(--foreground)] mb-1.5">Rabatt %</label>
            <input
              name="percent"
              type="number"
              required
              min={1}
              max={100}
              className="input-clean"
              placeholder="10"
            />
          </div>
          <button type="submit" className="btn-accent px-5 py-2.5 rounded text-sm font-medium w-full sm:w-auto">
            Opprett
          </button>
        </form>
      </div>

      {codes.length === 0 && (
        <p className="text-center text-muted py-16">Ingen rabattkoder ennå</p>
      )}

      <div className="flex flex-col divide-y divide-[var(--border-soft)] border-y border-soft">
        {codes.map((c) => (
          <div key={c.id} className="py-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono font-medium text-[var(--foreground)]">{c.code}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-muted">{c.percent}%</span>
                {c.active ? (
                  <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    Aktiv
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                    Inaktiv
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-1 shrink-0 text-sm">
              <form action={toggleDiscountCode.bind(null, c.id, !c.active)}>
                <button type="submit" className="text-muted hover:text-accent transition-colors px-2 py-1">
                  {c.active ? "Deaktiver" : "Aktiver"}
                </button>
              </form>
              <form action={deleteDiscountCode.bind(null, c.id)}>
                <button type="submit" className="text-muted hover:text-red-600 transition-colors px-2 py-1">
                  Slett
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
