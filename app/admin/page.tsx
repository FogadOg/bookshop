import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { signOut, auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/logg-inn");

  const [books, orderCount] = await Promise.all([
    prisma.book.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.count(),
  ]);

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex gap-2">
          <Link href="/admin/ordre" className="btn btn-outline btn-sm">
            Ordre ({orderCount})
          </Link>
          <Link href="/admin/rabattkoder" className="btn btn-outline btn-sm">
            Rabattkoder
          </Link>
          <form action={async () => { "use server"; await signOut({ redirect: false }); redirect("/admin/logg-inn"); }}>
            <button className="btn btn-ghost btn-sm">Logg ut</button>
          </form>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Bøker</h2>
        <Link href="/admin/boker/ny" className="btn btn-neutral btn-sm">+ Ny bok</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table bg-white">
          <thead>
            <tr>
              <th>Tittel</th>
              <th>Forfatter</th>
              <th>Pris</th>
              <th>Lager</th>
              <th>Kategori</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td className="font-medium">{book.title}</td>
                <td>{book.author}</td>
                <td>{book.price} kr</td>
                <td>{book.stock === 0 ? <span className="badge badge-error badge-sm">Utsolgt</span> : book.stock}</td>
                <td>{book.category}</td>
                <td>
                  <Link href={`/admin/boker/${book.id}`} className="btn btn-ghost btn-xs">Rediger</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
