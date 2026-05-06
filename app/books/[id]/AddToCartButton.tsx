"use client";

import { useCart } from "../../context/CartContext";

type Props = {
  book: { bookId: string; title: string; price: number; stock: number };
};

export default function AddToCartButton({ book }: Props) {
  const { addToCart } = useCart();

  if (book.stock === 0) {
    return (
      <button className="btn-accent px-5 py-2.5 rounded text-sm font-medium" disabled>
        Utsolgt
      </button>
    );
  }

  return (
    <button
      className="btn-accent px-5 py-2.5 rounded text-sm font-medium"
      onClick={() => addToCart(book)}
    >
      Legg i handlekurv
    </button>
  );
}
