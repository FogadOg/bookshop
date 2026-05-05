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
    <main className="w-full sm:max-w-2xl sm:mx-auto px-[10px] sm:px-6 py-10">
      <div className="mb-8">
        <Link href="/admin" className="btn btn-outline btn-sm mb-4">Tilbake</Link>
        <h1 className="text-2xl font-bold tracking-tight">Rabattkoder</h1>
        <p className="text-sm text-gray-400 mt-0.5">{codes.length} koder totalt</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-6">
        <h2 className="font-semibold mb-4">Ny rabattkode</h2>
        <form action={createDiscountCode} className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1">
            <label className="label pt-0"><span className="label-text font-medium">Kode</span></label>
            <input
              name="code"
              required
              className="input input-bordered w-full bg-white border border-gray-200"
              placeholder="F.eks. BOKHANDEL10"
            />
          </div>
          <div className="sm:w-28">
            <label className="label pt-0"><span className="label-text font-medium">Rabatt %</span></label>
            <input
              name="percent"
              type="number"
              required
              min={1}
              max={100}
              className="input input-bordered w-full bg-white border border-gray-200"
              placeholder="10"
            />
          </div>
          <button type="submit" className="btn btn-neutral w-full sm:w-auto">Opprett</button>
        </form>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {codes.length === 0 && (
          <p className="text-center text-gray-400 py-10">Ingen rabattkoder ennå</p>
        )}
        {codes.map((c) => (
          <div key={c.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono font-medium">{c.code}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">{c.percent}%</span>
                {c.active
                  ? <span className="badge badge-success badge-sm">Aktiv</span>
                  : <span className="badge badge-ghost badge-sm">Inaktiv</span>}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <form action={toggleDiscountCode.bind(null, c.id, !c.active)}>
                <button type="submit" className="btn btn-ghost btn-xs">{c.active ? "Deaktiver" : "Aktiver"}</button>
              </form>
              <form action={deleteDiscountCode.bind(null, c.id)}>
                <button type="submit" className="btn btn-ghost btn-xs text-error">Slett</button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="table bg-white">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th>Kode</th>
              <th>Rabatt</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="font-mono font-medium">{c.code}</td>
                <td className="font-medium">{c.percent}%</td>
                <td>
                  {c.active
                    ? <span className="badge badge-success badge-sm">Aktiv</span>
                    : <span className="badge badge-ghost badge-sm">Inaktiv</span>}
                </td>
                <td className="flex gap-1 justify-end">
                  <form action={toggleDiscountCode.bind(null, c.id, !c.active)}>
                    <button type="submit" className="btn btn-ghost btn-xs">
                      {c.active ? "Deaktiver" : "Aktiver"}
                    </button>
                  </form>
                  <form action={deleteDiscountCode.bind(null, c.id)}>
                    <button type="submit" className="btn btn-ghost btn-xs text-error">Slett</button>
                  </form>
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-10">Ingen rabattkoder ennå</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
