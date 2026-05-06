"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  stock: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (book: { bookId: string; title: string; price: number; stock: number }) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  function save(transform: (prev: CartItem[]) => CartItem[]) {
    setItems((prev) => {
      const next = transform(prev);
      try {
        localStorage.setItem("cart", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function addToCart(book: { bookId: string; title: string; price: number; stock: number }) {
    save((prev) => {
      const existing = prev.find((i) => i.bookId === book.bookId);
      if (existing) {
        if (existing.quantity >= book.stock) return prev;
        setToast(book.title);
        return prev.map((i) =>
          i.bookId === book.bookId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      setToast(book.title);
      return [...prev, { ...book, quantity: 1 }];
    });
  }

  function removeFromCart(bookId: string) {
    save((prev) => prev.filter((i) => i.bookId !== bookId));
  }

  function updateQuantity(bookId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(bookId);
    } else {
      save((prev) =>
        prev.map((i) => (i.bookId === bookId ? { ...i, quantity } : i))
      );
    }
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice =
    Math.round(
      items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100
    ) / 100;

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-[fadeIn_0.2s_ease-out] max-w-sm">
          <div
            className="bg-surface border border-default text-[var(--foreground)] text-sm px-5 py-4 rounded-md shadow-lg flex items-start gap-3"
            style={{ boxShadow: "0 8px 24px rgba(26,26,26,0.08)" }}
          >
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] shrink-0 mt-0.5"
              style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
            >
              ✓
            </span>
            <div>
              <p className="font-medium leading-snug">Lagt i handlekurven</p>
              <p className="text-muted text-xs mt-0.5 truncate">{toast}</p>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
