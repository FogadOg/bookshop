import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { formatPrice } from "../../../lib/format";
import BackButton from "./BackButton";

async function getRelatedBooks(bookId: string, category: string) {
  // Find orders that include this book
  const ordersWithBook = await prisma.orderItem.findMany({
    where: { bookId },
    select: { orderId: true },
  });
  const orderIds = ordersWithBook.map((o) => o.orderId);

  // Count how often each other book appears in those same orders
  const coBoughtCounts = await prisma.orderItem.groupBy({
    by: ["bookId"],
    where: {
      orderId: { in: orderIds },
      bookId: { not: bookId },
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 4,
  });

  const coBoughtIds = coBoughtCounts.map((c) => c.bookId);

  if (coBoughtIds.length >= 4) {
    return prisma.book.findMany({ where: { id: { in: coBoughtIds } } });
  }

  // Fallback: fill with books from the same category
  const fallback = await prisma.book.findMany({
    where: {
      category,
      id: { not: bookId, notIn: coBoughtIds },
    },
    take: 4 - coBoughtIds.length,
  });

  if (coBoughtIds.length === 0) return fallback;

  const coBought = await prisma.book.findMany({ where: { id: { in: coBoughtIds } } });
  return [...coBought, ...fallback];
}

export default async function BokDetaljPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

  const related = await getRelatedBooks(id, book.category);

  return (
    <main className="w-full sm:max-w-5xl sm:mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <BackButton />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div className="bg-[var(--accent-soft)]/30 rounded-md aspect-[3/4] md:sticky md:top-24 md:self-start overflow-hidden">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full h-full object-contain p-8"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-soft text-sm">
              Ingen omslag tilgjengelig
            </div>
          )}
        </div>

        <div className="md:pt-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">{book.category}</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-3">
            {book.title}
          </h1>
          <p className="text-lg text-muted mb-6">av {book.author}</p>

          <p className="text-[var(--foreground)] leading-relaxed mb-8">{book.description}</p>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-semibold">{formatPrice(book.price * 1.25)}</span>
            <span className="text-muted">kr</span>
          </div>
          <p className="text-xs text-muted-soft mb-8">Inkl. mva</p>

          <div className="mb-10">
            <AddToCartButton book={{ bookId: book.id, title: book.title, price: book.price, stock: book.stock }} />
            {book.stock > 0 && book.stock < 5 && (
              <p className="text-xs text-accent mt-3">Kun {book.stock} igjen på lager</p>
            )}
          </div>

          <div className="border-t border-soft pt-6 space-y-3">
            <DetailRow label="ISBN" value={book.isbn} />
            <DetailRow label="Kategori" value={book.category} />
            <DetailRow
              label="Lager"
              value={book.stock === 0 ? "Utsolgt" : `${book.stock} på lager`}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 pt-10 border-t border-soft">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">Anbefalt</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
            Kunder som kjøpte denne, kjøpte også
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((b) => (
              <Link key={b.id} href={`/books/${b.id}`} className="group">
                <div className="relative overflow-hidden rounded-md bg-[var(--accent-soft)]/30 aspect-[3/4] mb-4">
                  {b.imageUrl ? (
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-soft text-xs">
                      Ingen omslag
                    </div>
                  )}
                </div>
                <p className="text-[11px] uppercase tracking-wider text-muted-soft mb-1.5">{b.category}</p>
                <p className="font-medium text-sm leading-snug text-[var(--foreground)] group-hover:text-accent transition-colors">
                  {b.title}
                </p>
                <p className="text-sm text-muted mt-0.5">{b.author}</p>
                <p className="text-sm font-medium mt-2">{formatPrice(b.price * 1.25)} kr</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-[var(--foreground)]">{value}</span>
    </div>
  );
}
