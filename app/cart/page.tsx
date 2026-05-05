"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Handlekurven er tom</h1>
        <p className="text-gray-400 mb-6">Du har ikke lagt til noen bøker ennå.</p>
        <Link href="/" className="btn btn-neutral">Gå til butikken</Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Handlekurv</h1>

      <div className="flex flex-col gap-3 mb-6">
        {items.map((item) => (
          <div key={item.bookId} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.title}</p>
              <p className="text-sm text-gray-400">{item.price} kr per stk</p>
            </div>
            <div className="flex items-center gap-2 mx-4">
              <button
                className="btn btn-sm btn-ghost btn-circle border border-gray-200"
                onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
              >
                −
              </button>
              <span className="w-6 text-center font-medium">{item.quantity}</span>
              <button
                className="btn btn-sm btn-ghost btn-circle border border-gray-200"
                onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                +
              </button>
            </div>
            <div className="text-right min-w-17.5">
              <p className="font-bold">{Math.round(item.price * item.quantity * 100) / 100} kr</p>
              <button
                className="text-xs text-error hover:underline mt-1"
                onClick={() => removeFromCart(item.bookId)}
              >
                Fjern
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Subtotal eks. mva</span>
          <span>{totalPrice} kr</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>MVA (25%)</span>
          <span>{Math.round(totalPrice * 0.25 * 100) / 100} kr</span>
        </div>
        <div className="divider my-0" />
        <div className="flex justify-between font-bold text-lg mt-3">
          <span>Totalt inkl. mva</span>
          <span>{Math.round(totalPrice * 1.25 * 100) / 100} kr</span>
        </div>
      </div>

      <Link href="/checkout" className="btn btn-neutral w-full">
        Gå til kassen →
      </Link>
    </main>
  );
}
