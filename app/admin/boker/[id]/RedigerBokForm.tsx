"use client";

import { useState } from "react";
import { Book } from "@prisma/client";
import { updateBook, deleteBook } from "../actions";

export default function RedigerBokForm({ book }: { book: Book }) {
  const [preview, setPreview] = useState<string | null>(book.imageUrl ?? null);

  const update = updateBook.bind(null, book.id);
  const remove = deleteBook.bind(null, book.id);

  return (
    <>
      <form action={update} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-4 mb-4">
        <input type="hidden" name="imageUrl" value={book.imageUrl ?? ""} />
        <div>
          <label className="label pt-0"><span className="label-text font-medium">Tittel</span></label>
          <input name="title" required defaultValue={book.title} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label pt-0"><span className="label-text font-medium">Forfatter</span></label>
          <input name="author" required defaultValue={book.author} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label pt-0"><span className="label-text font-medium">Beskrivelse</span></label>
          <textarea name="description" required defaultValue={book.description} className="textarea textarea-bordered w-full" rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label pt-0"><span className="label-text font-medium">Pris (kr)</span></label>
            <input name="price" type="number" step="0.01" required defaultValue={book.price} className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label pt-0"><span className="label-text font-medium">Lager</span></label>
            <input name="stock" type="number" min="0" required defaultValue={book.stock} className="input input-bordered w-full" />
          </div>
        </div>
        <div>
          <label className="label pt-0"><span className="label-text font-medium">ISBN</span></label>
          <input name="isbn" required defaultValue={book.isbn} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label pt-0"><span className="label-text font-medium">Kategori</span></label>
          <input name="category" required defaultValue={book.category} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label pt-0"><span className="label-text font-medium">Bilde (valgfritt)</span></label>
          {preview && (
            <img src={preview} alt="Forhåndsvisning" className="w-full h-48 object-cover rounded-lg mb-2" />
          )}
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
              else setPreview(book.imageUrl ?? null);
            }}
          />
        </div>
        <button type="submit" className="btn btn-neutral mt-2">Lagre endringer</button>
      </form>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-error mb-1">Faresone</h2>
        <p className="text-sm text-gray-400 mb-3">Dette kan ikke angres.</p>
        <form action={remove}>
          <button type="submit" className="btn btn-error btn-outline w-full">Slett bok</button>
        </form>
      </div>
    </>
  );
}
