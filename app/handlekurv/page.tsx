"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function HandlekurvPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Handlekurven er tom</h1>
        <Link href="/" className="btn btn-neutral">Gå til butikken</Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Handlekurv</h1>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.bookId} className="flex items-center justify-between border rounded-lg p-4 bg-white">
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">{item.price} kr per stk</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
              >
                -
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                +
              </button>
            </div>
            <div className="ml-4 text-right">
              <p className="font-bold">{item.price * item.quantity} kr</p>
              <button
                className="text-xs text-red-500 hover:underline"
                onClick={() => removeFromCart(item.bookId)}
              >
                Fjern
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="divider" />
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center justify-between text-gray-500">
          <span>Subtotal eks. mva</span>
          <span>{totalPrice} kr</span>
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <span>MVA (25%)</span>
          <span>{Math.round(totalPrice * 0.25 * 100) / 100} kr</span>
        </div>
        <div className="flex items-center justify-between text-lg font-bold mt-1">
          <span>Totalt inkl. mva</span>
          <span>{Math.round(totalPrice * 1.25 * 100) / 100} kr</span>
        </div>
      </div>
      <Link href="/checkout" className="btn btn-neutral w-full">
        Gå til checkout
      </Link>
    </main>
  );
}
