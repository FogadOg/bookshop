"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../../lib/format";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="w-full sm:max-w-2xl sm:mx-auto px-4 sm:px-8 py-24 text-center">
        <div className="flex justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-muted-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Handlekurven er tom</h1>
        <p className="text-muted mb-8">Du har ikke lagt til noen bøker ennå.</p>
        <Link href="/" className="btn-accent inline-block px-6 py-2.5 rounded text-sm font-medium">
          Utforsk bøker
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full sm:max-w-3xl sm:mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10">Handlekurv</h1>

      <div className="flex flex-col divide-y divide-[var(--border-soft)] border-y border-soft mb-10">
        {items.map((item) => (
          <div key={item.bookId} className="flex flex-col sm:flex-row sm:items-center gap-4 py-5">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--foreground)] truncate">{item.title}</p>
              <p className="text-sm text-muted mt-0.5">{formatPrice(item.price * 1.25)} kr per stk</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6">
              <div className="flex items-center border border-default rounded">
                <button
                  className="w-8 h-8 flex items-center justify-center text-muted hover:text-accent transition-colors disabled:opacity-30"
                  onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center text-muted hover:text-accent transition-colors disabled:opacity-30"
                  onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>
              <div className="text-right min-w-24">
                <p className="font-medium">{formatPrice(item.price * item.quantity * 1.25)} kr</p>
                <button
                  className="text-xs text-muted hover:text-accent transition-colors mt-1"
                  onClick={() => removeFromCart(item.bookId)}
                >
                  Fjern
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--accent-soft)]/30 rounded-md p-6 mb-6">
        <div className="flex justify-between text-sm text-muted mb-2">
          <span>Herav mva (25%)</span>
          <span>{formatPrice(totalPrice * 0.25)} kr</span>
        </div>
        <div className="border-t border-soft pt-3 mt-3 flex justify-between items-baseline">
          <span className="font-medium text-[var(--foreground)]">Totalt inkl. mva</span>
          <span className="text-2xl font-semibold">{formatPrice(totalPrice * 1.25)} kr</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="btn-accent flex items-center justify-center w-full py-3 rounded text-sm font-medium"
      >
        Gå til kassen
      </Link>
    </main>
  );
}
