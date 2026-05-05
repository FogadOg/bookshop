"use client";

import { Book } from "@prisma/client";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function BookCard({ book }: { book: Book }) {
  const { addToCart, items } = useCart();

  const cartItem = items.find((i) => i.bookId === book.id);
  const atStockLimit = cartItem ? cartItem.quantity >= book.stock : false;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart({ bookId: book.id, title: book.title, price: book.price, stock: book.stock });
  }

  return (
    <Link
      href={`/books/${book.id}`}
      className="card bg-white border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col h-full"
    >
      {book.imageUrl && (
        <img src={book.imageUrl} alt={book.title} className="rounded-t-xl w-full h-48 object-contain bg-gray-50" />
      )}
      <div className="card-body gap-2 p-5 flex flex-col flex-1 min-h-0">
        <span className="badge badge-neutral badge-sm w-fit">{book.category}</span>
        <h2 className="font-bold text-lg leading-snug">{book.title}</h2>
        <p className="text-sm text-gray-500">{book.author}</p>
        <p className="text-sm text-gray-400 line-clamp-2">{book.description}</p>
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-base">{book.price} kr</span>
            {book.stock === 0
              ? <span className="badge badge-error badge-sm">Utsolgt</span>
              : <span className="text-xs text-gray-400">Lager: {book.stock}</span>}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0 || atStockLimit}
            className="btn btn-neutral btn-sm w-full"
          >
            {book.stock === 0 ? "Utsolgt" : "Legg i handlekurv"}
          </button>
        </div>
      </div>
    </Link>
  );
}
