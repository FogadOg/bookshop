import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import { formatPrice } from "../../../lib/format";
import BackButton from "./BackButton";

export default async function BokDetaljPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

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
