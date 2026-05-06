"use client";

import { useCart } from "../context/CartContext";
import { createOrder, validateDiscountCode } from "./actions";
import Link from "next/link";
import { useState, useTransition } from "react";
import { formatPrice } from "../../lib/format";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [isPending, startTransition] = useTransition();
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  if (items.length === 0) {
    return (
      <main className="w-full sm:max-w-2xl sm:mx-auto px-4 sm:px-8 py-24 text-center">
        <div className="flex justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-muted-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Handlekurven er tom</h1>
        <p className="text-muted mb-8">Legg til noen bøker før du går til kassen.</p>
        <Link href="/" className="btn-accent inline-block px-6 py-2.5 rounded text-sm font-medium">
          Utforsk bøker
        </Link>
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
    <main className="w-full sm:max-w-3xl sm:mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10">Kasse</h1>

      <div className="border border-soft rounded-md p-6 mb-8 bg-surface">
        <h2 className="text-sm uppercase tracking-wider text-muted mb-4">Oppsummering</h2>
        <div className="flex flex-col gap-2 mb-4">
          {items.map((item) => (
            <div key={item.bookId} className="flex justify-between text-sm">
              <span className="text-[var(--foreground)] truncate pr-3">{item.title} <span className="text-muted">× {item.quantity}</span></span>
              <span className="text-[var(--foreground)] shrink-0">{formatPrice(item.price * item.quantity * 1.25)} kr</span>
            </div>
          ))}
        </div>
        {discountPercent && (
          <div className="flex justify-between text-sm text-accent font-medium border-t border-soft pt-3 mb-2">
            <span>Rabatt ({discountPercent}%)</span>
            <span>−{formatPrice(totalPrice * 1.25 * (discountPercent / 100))} kr</span>
          </div>
        )}
        <div className="border-t border-soft pt-3 mt-1 space-y-1">
          <div className="flex justify-between text-sm text-muted">
            <span>Herav mva (25%)</span>
            <span>{formatPrice(mva)} kr</span>
          </div>
          <div className="flex justify-between items-baseline pt-1">
            <span className="font-medium">Totalt inkl. mva</span>
            <span className="text-2xl font-semibold">{formatPrice(grandTotal)} kr</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div>
          <h2 className="text-sm uppercase tracking-wider text-muted mb-3">Rabattkode</h2>
          <div className="flex gap-2">
            <input
              name="discountCode"
              value={discountCode}
              onChange={(e) => {
                setDiscountCode(e.target.value);
                setDiscountPercent(null);
                setDiscountError("");
              }}
              className="input-clean flex-1"
              placeholder="F.eks. BOKHANDEL10"
            />
            <button
              type="button"
              onClick={handleValidateCode}
              disabled={isValidating || !discountCode.trim() || !!discountPercent}
              className="btn-accent px-5 rounded text-sm font-medium shrink-0"
            >
              {isValidating ? "..." : "Bruk"}
            </button>
          </div>
          {discountPercent && (
            <p className="text-accent text-sm mt-2">✓ {discountPercent}% rabatt brukt</p>
          )}
          {discountError && (
            <p className="text-red-600 text-sm mt-2">{discountError}</p>
          )}
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-wider text-muted mb-4">Leveringsinfo</h2>
          <div className="flex flex-col gap-4">
            <Field label="Navn">
              <input name="customerName" required className="input-clean" placeholder="Ola Nordmann" />
            </Field>
            <Field label="E-post">
              <input name="customerEmail" type="email" required className="input-clean" placeholder="ola@example.com" />
            </Field>
            <Field label="Leveringsadresse">
              <textarea name="address" required className="input-clean resize-none" placeholder="Gateadresse, postnummer, by" rows={3} />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-accent w-full py-3 rounded text-sm font-medium"
        >
          {isPending ? "Behandler..." : `Betal ${formatPrice(grandTotal)} kr`}
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-[var(--foreground)] mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
