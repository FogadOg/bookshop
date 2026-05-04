import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { signOut, auth } from "../../auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const [books, orderCount] = await Promise.all([
    prisma.book.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.count(),
  ]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="text-sm text-gray-400 mt-0.5">Bokhandelen</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orders" className="btn btn-outline btn-sm">
            Ordre
            <span className="badge badge-neutral badge-sm ml-1">{orderCount}</span>
          </Link>
          <Link href="/admin/discount-codes" className="btn btn-outline btn-sm">
            Rabattkoder
          </Link>
          <form action={async () => { "use server"; await signOut({ redirect: false }); redirect("/admin/login"); }}>
            <button className="btn btn-ghost btn-sm text-gray-400">Logg ut</button>
          </form>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Bøker ({books.length})</h2>
        <Link href="/admin/books/new" className="btn btn-neutral btn-sm">+ New book</Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="table bg-white">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
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
              <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                <td className="font-medium">{book.title}</td>
                <td className="text-gray-500">{book.author}</td>
                <td>{book.price} kr</td>
                <td>
                  {book.stock === 0
                    ? <span className="badge badge-error badge-sm">Utsolgt</span>
                    : <span className="text-sm">{book.stock}</span>}
                </td>
                <td><span className="badge badge-ghost badge-sm">{book.category}</span></td>
                <td>
                  <Link href={`/admin/books/${book.id}`} className="btn btn-ghost btn-xs">Rediger</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
