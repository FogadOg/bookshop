import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { signOut, auth } from "../../auth";
import { redirect } from "next/navigation";
import { formatPrice } from "../../lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const [books, orderCount] = await Promise.all([
    prisma.book.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.count(),
  ]);

  return (
    <main className="w-full sm:max-w-6xl sm:mx-auto px-4 sm:px-8 py-12 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-soft">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">Admin</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Oversikt</h1>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/orders" className="px-3 py-1.5 bg-surface border border-default rounded hover:border-accent hover:text-accent transition-colors flex items-center gap-2 text-[var(--foreground)]">
            Ordre
            <span className="bg-accent text-white text-[10px] font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {orderCount}
            </span>
          </Link>
          <Link href="/admin/discount-codes" className="px-3 py-1.5 bg-surface border border-default rounded hover:border-accent hover:text-accent transition-colors text-[var(--foreground)]">
            Rabattkoder
          </Link>
          <form action={async () => { "use server"; await signOut({ redirect: false }); redirect("/admin/login"); }}>
            <button className="px-3 py-1.5 border border-default rounded text-muted hover:border-accent hover:text-accent transition-colors bg-surface">
              Logg ut
            </button>
          </form>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm uppercase tracking-wider text-muted">Bøker ({books.length})</h2>
        <Link href="/admin/books/new" className="btn-accent text-sm font-medium px-4 py-2 rounded">
          + Ny bok
        </Link>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col divide-y divide-[var(--border-soft)] border-y border-soft sm:hidden">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/admin/books/${book.id}`}
            className={`flex items-center gap-3 py-4 hover:opacity-70 transition-opacity ${book.archived ? "opacity-50" : ""}`}
          >
            <div className="w-12 h-16 bg-[var(--accent-soft)]/30 rounded shrink-0 overflow-hidden">
              {book.imageUrl && (
                <img src={book.imageUrl} alt="" className="w-full h-full object-contain p-1" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{book.title}</p>
              <p className="text-xs text-muted truncate">{book.author}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] uppercase tracking-wider text-muted-soft">{book.category}</span>
                {book.archived && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">Arkivert</span>}
                {book.stock === 0 && !book.archived && <span className="text-[10px] text-accent">Utsolgt</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-medium text-sm">{formatPrice(book.price)} kr</p>
              <p className="text-xs text-muted-soft">Lager: {book.stock}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-default">
              <th className="py-3 font-medium">Tittel</th>
              <th className="py-3 font-medium">Forfatter</th>
              <th className="py-3 font-medium">Kategori</th>
              <th className="py-3 font-medium text-right">Pris</th>
              <th className="py-3 font-medium text-right">Lager</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-soft)]">
            {books.map((book) => (
              <tr key={book.id} className={`hover:bg-[var(--accent-soft)]/20 transition-colors group ${book.archived ? "opacity-50" : ""}`}>
                <td className="py-3.5 font-medium">
                  <span className="flex items-center gap-2">
                    {book.title}
                    {book.archived && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">Arkivert</span>}
                  </span>
                </td>
                <td className="py-3.5 text-muted">{book.author}</td>
                <td className="py-3.5 text-muted">{book.category}</td>
                <td className="py-3.5 text-right">{formatPrice(book.price)} kr</td>
                <td className="py-3.5 text-right">
                  {book.stock === 0
                    ? <span className="text-accent">Utsolgt</span>
                    : <span>{book.stock}</span>}
                </td>
                <td className="py-3.5 text-right">
                  <Link
                    href={`/admin/books/${book.id}`}
                    style={{ color: "var(--accent)" }}
                    className="text-sm hover:underline"
                  >
                    Rediger
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
