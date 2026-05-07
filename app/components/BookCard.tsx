"use client";

import { Book } from "@prisma/client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../../lib/format";

export default function BookCard({ book }: { book: Book }) {
  const { addToCart, updateQuantity, items } = useCart();

  const cartItem = items.find((i) => i.bookId === book.id);
  const inCart = !!cartItem;
  const atStockLimit = cartItem ? cartItem.quantity >= book.stock : false;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart({ bookId: book.id, title: book.title, price: book.price, stock: book.stock });
  }

  function handleDecrease(e: React.MouseEvent) {
    e.preventDefault();
    if (cartItem) updateQuantity(book.id, cartItem.quantity - 1);
  }

  function handleIncrease(e: React.MouseEvent) {
    e.preventDefault();
    if (cartItem && !atStockLimit) updateQuantity(book.id, cartItem.quantity + 1);
  }

  return (
    <Link
      href={`/books/${book.id}`}
      className="group flex flex-col h-full"
    >
      <div className="relative overflow-hidden rounded-md bg-[var(--accent-soft)]/30 aspect-[3/4] mb-4">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-soft text-xs">
            Ingen omslag
          </div>
        )}
        {book.stock === 0 && (
          <div className="absolute top-3 right-3 bg-[var(--foreground)] text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded">
            Utsolgt
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <p className="text-[11px] uppercase tracking-wider text-muted-soft mb-1.5">{book.category}</p>
        <h2 className="font-medium text-base leading-snug text-[var(--foreground)] group-hover:text-accent transition-colors">
          {book.title}
        </h2>
        <p className="text-sm text-muted mt-0.5 mb-3">{book.author}</p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="font-medium text-[var(--foreground)]">{formatPrice(book.price * 1.25)} kr</span>
          {inCart && cartItem ? (
            <div className="flex items-center border border-default rounded">
              <button
                type="button"
                onClick={handleDecrease}
                className="w-7 h-7 flex items-center justify-center text-muted hover:text-accent transition-colors"
              >
                −
              </button>
              <span className="w-7 text-center text-xs font-medium">{cartItem.quantity}</span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={atStockLimit}
                className="w-7 h-7 flex items-center justify-center text-muted hover:text-accent transition-colors disabled:opacity-30"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className="btn-accent text-xs font-medium px-3 py-1.5 rounded"
            >
              {book.stock === 0 ? "Utsolgt" : "Legg til"}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
