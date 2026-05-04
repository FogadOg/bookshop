"use client";

import { useCart } from "../../context/CartContext";

type Props = {
  book: { bookId: string; title: string; price: number; stock: number };
};

export default function AddToCartButton({ book }: Props) {
  const { addToCart } = useCart();

  function handleAdd() {
    addToCart(book);
  }

  if (book.stock === 0) {
    return <button className="btn btn-disabled" disabled>Utsolgt</button>;
  }

  return (
    <button className="btn btn-neutral" onClick={handleAdd}>
      Legg i handlekurv
    </button>
  );
}
