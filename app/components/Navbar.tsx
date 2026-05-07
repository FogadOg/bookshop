"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
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
    <nav className="bg-[var(--background)]/80 backdrop-blur border-b border-soft w-full sticky top-0 z-50">
      <div className="w-full sm:max-w-6xl sm:mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg tracking-tight font-semibold">
          Bokhandelen
        </Link>
        {isAdmin ? (
          <Link
            href="/admin"
            className="text-sm font-medium px-3 py-1.5 border border-default rounded hover:border-accent hover:text-accent transition-colors"
          >
            Admin
          </Link>
        ) : (
          <Link href="/cart" className="relative p-2 -mr-2 hover:opacity-70 transition-opacity">
            {totalItems > 0 && (
              <span
                className={`absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 transition-transform ${bump ? "scale-125" : "scale-100"}`}
                style={{ transitionDuration: "200ms" }}
              >
                {totalItems}
              </span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 114 0z" />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
}
