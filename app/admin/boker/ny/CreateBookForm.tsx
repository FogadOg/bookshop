"use client";

import { useRef, useState } from "react";
import { createBook } from "../actions";

type BookFields = {
  title: string;
  author: string;
  isbn: string;
  imageUrl: string;
};

async function fetchBookByIsbn(isbn: string): Promise<Partial<BookFields> | null> {
  const res = await fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`
  );
  const data = await res.json();
  const book = data[`ISBN:${isbn}`];
  if (!book) return null;
  return {
    title: book.title ?? "",
    author: book.authors?.[0]?.name ?? "",
    isbn,
    imageUrl: book.cover?.large ?? book.cover?.medium ?? "",
  };
}

export default function CreateBookForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fields, setFields] = useState<Partial<BookFields>>({});
  const isbnRef = useRef<HTMLInputElement>(null);

  async function handleIsbnLookup() {
    const isbn = isbnRef.current?.value.trim();
    if (!isbn) return;
    setFetching(true);
    const result = await fetchBookByIsbn(isbn);
    setFetching(false);
    if (!result) {
      alert("No book found for this ISBN.");
      return;
    }
    setFields(result);
    if (result.imageUrl) setPreview(result.imageUrl);
  }

  return (
    <form action={createBook} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-4">
      <input type="hidden" name="imageUrl" value={fields.imageUrl ?? ""} />

      <div>
        <label className="label pt-0"><span className="label-text font-medium">ISBN</span></label>
        <div className="flex gap-2">
          <input
            ref={isbnRef}
            name="isbn"
            required
            defaultValue={fields.isbn ?? ""}
            className="input input-bordered flex-1"
            placeholder="9780140328721"
          />
          <button
            type="button"
            onClick={handleIsbnLookup}
            disabled={fetching}
            className="btn btn-outline btn-neutral"
          >
            {fetching ? <span className="loading loading-spinner loading-sm" /> : "Fetch info"}
          </button>
        </div>
      </div>

      <div>
        <label className="label pt-0"><span className="label-text font-medium">Title</span></label>
        <input name="title" required key={fields.title} defaultValue={fields.title ?? ""} className="input input-bordered w-full" />
      </div>
      <div>
        <label className="label pt-0"><span className="label-text font-medium">Author</span></label>
        <input name="author" required key={fields.author} defaultValue={fields.author ?? ""} className="input input-bordered w-full" />
      </div>
      <div>
        <label className="label pt-0"><span className="label-text font-medium">Description</span></label>
        <textarea name="description" required className="textarea textarea-bordered w-full" rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label pt-0"><span className="label-text font-medium">Price (kr)</span></label>
          <input name="price" type="number" step="0.01" required className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label pt-0"><span className="label-text font-medium">Stock</span></label>
          <input name="stock" type="number" min="0" required className="input input-bordered w-full" />
        </div>
      </div>
      <div>
        <label className="label pt-0"><span className="label-text font-medium">Category</span></label>
        <input name="category" required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="label pt-0"><span className="label-text font-medium">Image (optional)</span></label>
        {preview && (
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2" />
        )}
        <input
          name="imageFile"
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
            else setPreview(fields.imageUrl ?? null);
          }}
        />
        <p className="text-xs text-gray-400 mt-1">Upload a file, or leave empty to use the cover from Open Library.</p>
      </div>
      <button type="submit" className="btn btn-neutral mt-2">Create book</button>
    </form>
  );
}
