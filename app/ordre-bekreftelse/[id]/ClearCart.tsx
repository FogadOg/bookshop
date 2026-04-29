"use client";

import { useCart } from "../../context/CartContext";
import { useEffect } from "react";

export default function ClearCart() {
  const { items, removeFromCart } = useCart();

  useEffect(() => {
    items.forEach((item) => removeFromCart(item.bookId));
  }, []);

  return null;
}
