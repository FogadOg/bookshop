import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default async function BokDetaljPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <Link href="/" className="btn btn-ghost btn-sm mb-6">← Tilbake</Link>

      {book.imageUrl && (
        <img src={book.imageUrl} alt={book.title} className="rounded-xl w-full object-contain mb-6" />
      )}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        <span className="badge badge-neutral badge-sm mb-3">{book.category}</span>
        <h1 className="text-2xl font-bold leading-snug mb-1">{book.title}</h1>
        <p className="text-gray-500 mb-4">{book.author}</p>
        <p className="text-gray-700 leading-relaxed mb-6">{book.description}</p>

        <div className="divider my-0 mb-4" />

        <div className="grid grid-cols-2 gap-2 text-sm mb-6">
          <span className="text-gray-400">ISBN</span>
          <span className="font-medium">{book.isbn}</span>
          <span className="text-gray-400">Kategori</span>
          <span className="font-medium">{book.category}</span>
          <span className="text-gray-400">Lager</span>
          <span className="font-medium">
            {book.stock === 0
              ? <span className="badge badge-error badge-sm">Utsolgt</span>
              : book.stock}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{book.price} kr</span>
          <AddToCartButton book={{ bookId: book.id, title: book.title, price: book.price, stock: book.stock }} />
        </div>
      </div>
    </main>
  );
}
