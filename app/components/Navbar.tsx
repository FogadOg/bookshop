"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { totalItems } = useCart();
  const [bump, setBump] = useState(false);
  const prevItems = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevItems.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 400);
      return () => clearTimeout(t);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  return (
    <nav className="bg-white border-b w-full sticky top-0 z-50">
      <div className="w-full sm:max-w-5xl sm:mx-auto px-[10px] sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">Bokhandelen</Link>
        <Link href="/cart" className="btn btn-ghost btn-circle indicator">
          {totalItems > 0 && (
            <span
              className={`indicator-item badge badge-neutral badge-sm transition-transform ${bump ? "scale-150" : "scale-100"}`}
              style={{ transitionDuration: "200ms" }}
            >
              {totalItems}
            </span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 114 0z" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
