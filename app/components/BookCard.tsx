"use client";

import { Book } from "@prisma/client";
import { useCart } from "../context/CartContext";

export default function BookCard({ book }: { book: Book }) {
  const id = `modal-${book.id}`;
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart({ bookId: book.id, title: book.title, price: book.price, stock: book.stock });
    (document.getElementById(id) as HTMLDialogElement).close();
  }

  return (
    <>
      <div
        className="card card-bordered bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => (document.getElementById(id) as HTMLDialogElement).showModal()}
      >
        <div className="card-body gap-1">
          <span className="badge badge-ghost badge-sm">{book.category}</span>
          <h2 className="card-title text-base">{book.title}</h2>
          <p className="text-sm text-gray-500">{book.author}</p>
          <p className="text-sm text-gray-400 flex-1 line-clamp-2">{book.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold">{book.price} kr</span>
            <span className="text-xs text-gray-400">Lager: {book.stock}</span>
          </div>
        </div>
      </div>

      <dialog id={id} className="modal">
        <div className="modal-box bg-white">
          <span className="badge badge-ghost mb-2">{book.category}</span>
          <h3 className="font-bold text-xl">{book.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{book.author}</p>
          <p className="py-2">{book.description}</p>
          <div className="divider" />
          <div className="flex flex-col gap-1 text-sm">
            <span><span className="font-medium">ISBN:</span> {book.isbn}</span>
            <span><span className="font-medium">Pris:</span> {book.price} kr</span>
            <span><span className="font-medium">Lager:</span> {book.stock}</span>
          </div>
          <div className="modal-action">
            <button className="btn btn-neutral" onClick={handleAddToCart}>
              Legg i handlekurv
            </button>
            <form method="dialog">
              <button className="btn">Lukk</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
