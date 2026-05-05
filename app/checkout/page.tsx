"use client";

import { useCart } from "../context/CartContext";
import { createOrder, validateDiscountCode } from "./actions";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [isPending, startTransition] = useTransition();
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Handlekurven er tom</h1>
        <p className="text-gray-400 mb-6">Legg til noen bøker før du går til kassen.</p>
        <Link href="/" className="btn btn-neutral">Gå til butikken</Link>
      </main>
    );
  }

  async function handleValidateCode() {
    if (!discountCode.trim()) return;
    setIsValidating(true);
    setDiscountError("");
    setDiscountPercent(null);
    const percent = await validateDiscountCode(discountCode);
    setIsValidating(false);
    if (percent !== null) {
      setDiscountPercent(percent);
    } else {
      setDiscountError("Ugyldig eller utløpt rabattkode");
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => createOrder(items, formData));
  }

  const discountedSubtotal = discountPercent
    ? Math.round(totalPrice * (1 - discountPercent / 100) * 100) / 100
    : totalPrice;
  const mva = Math.round(discountedSubtotal * 0.25 * 100) / 100;
  const grandTotal = Math.round(discountedSubtotal * 1.25 * 100) / 100;

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 w-full">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Kasse</h1>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-6">
        <h2 className="font-semibold mb-3">Oppsummering</h2>
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <div key={item.bookId} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.title} × {item.quantity}</span>
              <span>{Math.round(item.price * item.quantity * 100) / 100} kr</span>
            </div>
          ))}
        </div>
        <div className="divider my-3" />
        {discountPercent && (
          <div className="flex justify-between text-sm text-success font-medium mb-2">
            <span>Rabatt ({discountPercent}%)</span>
            <span>−{Math.round(totalPrice * (discountPercent / 100) * 100) / 100} kr</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Subtotal eks. mva</span>
          <span>{discountedSubtotal} kr</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>MVA (25%)</span>
          <span>{mva} kr</span>
        </div>
        <div className="flex justify-between font-bold text-base">
          <span>Totalt inkl. mva</span>
          <span>{grandTotal} kr</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-3">Rabattkode</h2>
          <div className="flex gap-2">
            <input
              name="discountCode"
              value={discountCode}
              onChange={(e) => {
                setDiscountCode(e.target.value);
                setDiscountPercent(null);
                setDiscountError("");
              }}
              className="input input-bordered flex-1 bg-white border border-gray-200"
              placeholder="F.eks. BOKHANDEL10"
            />
            <button
              type="button"
              onClick={handleValidateCode}
              disabled={isValidating || !discountCode.trim() || !!discountPercent}
              className="btn bg-gray-800 text-white border-none hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shrink-0"
            >
              {isValidating ? <span className="loading loading-spinner loading-sm" /> : "Bruk"}
            </button>
          </div>
          {discountPercent && (
            <p className="text-success text-sm mt-2 flex items-center gap-1">
              <span>✓</span> {discountPercent}% rabatt brukt
            </p>
          )}
          {discountError && (
            <p className="text-error text-sm mt-2">{discountError}</p>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col gap-4">
          <h2 className="font-semibold">Leveringsinfo</h2>
          <div>
            <label className="label pt-0"><span className="label-text font-medium">Navn</span></label>
            <input name="customerName" required className="input input-bordered w-full bg-white border border-gray-200" placeholder="Ola Nordmann" />
          </div>
          <div>
            <label className="label pt-0"><span className="label-text font-medium">E-post</span></label>
            <input name="customerEmail" type="email" required className="input input-bordered w-full bg-white border border-gray-200" placeholder="ola@example.com" />
          </div>
          <div>
            <label className="label pt-0"><span className="label-text font-medium">Leveringsadresse</span></label>
            <textarea name="address" required className="textarea textarea-bordered w-full bg-white border border-gray-200" placeholder="Gateadresse, postnummer, by" rows={3} />
          </div>
        </div>

        <button type="submit" disabled={isPending} className="btn btn-neutral w-full">
          {isPending ? <><span className="loading loading-spinner loading-sm" /> Behandler...</> : "Betal nå"}
        </button>
      </form>
    </main>
  );
}
