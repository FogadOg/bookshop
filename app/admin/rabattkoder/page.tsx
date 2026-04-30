import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { createDiscountCode, toggleDiscountCode, deleteDiscountCode } from "./actions";

export const dynamic = "force-dynamic";

export default async function RabattkoderPage() {
  const session = await auth();
  if (!session) redirect("/admin/logg-inn");

  const codes = await prisma.discountCode.findMany({ orderBy: { code: "asc" } });

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="btn btn-ghost btn-sm">Tilbake</Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rabattkoder</h1>
          <p className="text-sm text-gray-400 mt-0.5">{codes.length} koder totalt</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-6">
        <h2 className="font-semibold mb-4">Ny rabattkode</h2>
        <form action={createDiscountCode} className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="label pt-0"><span className="label-text font-medium">Kode</span></label>
            <input
              name="code"
              required
              className="input input-bordered w-full"
              placeholder="F.eks. BOKHANDEL10"
            />
          </div>
          <div className="w-28">
            <label className="label pt-0"><span className="label-text font-medium">Rabatt %</span></label>
            <input
              name="percent"
              type="number"
              required
              min={1}
              max={100}
              className="input input-bordered w-full"
              placeholder="10"
            />
          </div>
          <button type="submit" className="btn btn-neutral">Opprett</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
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
