"use client";

import { useCart } from "../context/CartContext";
import { createOrder } from "./actions";
import Link from "next/link";
import { useTransition } from "react";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Handlekurven er tom</h1>
        <Link href="/" className="btn btn-neutral">Gå til butikken</Link>
      </main>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => createOrder(items, formData));
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="border rounded-lg p-4 bg-white mb-6">
        <h2 className="font-semibold mb-3">Oppsummering</h2>
        {items.map((item) => (
          <div key={item.bookId} className="flex justify-between text-sm py-1">
            <span>{item.title} × {item.quantity}</span>
            <span>{Math.round(item.price * item.quantity * 100) / 100} kr</span>
          </div>
        ))}
        <div className="divider my-2" />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal eks. mva</span>
          <span>{totalPrice} kr</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>MVA (25%)</span>
          <span>{Math.round(totalPrice * 0.25 * 100) / 100} kr</span>
        </div>
        <div className="flex justify-between font-bold mt-1">
          <span>Totalt inkl. mva</span>
          <span>{Math.round(totalPrice * 1.25 * 100) / 100} kr</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label"><span className="label-text font-medium">Navn</span></label>
          <input
            name="customerName"
            required
            className="input input-bordered w-full"
            placeholder="Ola Nordmann"
          />
        </div>
        <div>
          <label className="label"><span className="label-text font-medium">E-post</span></label>
          <input
            name="customerEmail"
            type="email"
            required
            className="input input-bordered w-full"
            placeholder="ola@example.com"
          />
        </div>
        <div>
          <label className="label"><span className="label-text font-medium">Leveringsadresse</span></label>
          <textarea
            name="address"
            required
            className="textarea textarea-bordered w-full"
            placeholder="Gateadresse, postnummer, by"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-neutral w-full mt-2"
        >
          {isPending ? "Behandler..." : "Betal"}
        </button>
      </form>
    </main>
  );
}
