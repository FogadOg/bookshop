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
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fields, setFields] = useState<Partial<BookFields>>({});
  const isbnRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createBook(formData);
    if (result) setError(result);
  }

  async function handleIsbnLookup() {
    const isbn = isbnRef.current?.value.trim();
    if (!isbn) return;
    setFetching(true);
    const result = await fetchBookByIsbn(isbn);
    setFetching(false);
    if (!result) {
      alert("Ingen bok funnet for dette ISBN-nummeret.");
      return;
    }
    setFields(result);
    if (result.imageUrl) setPreview(result.imageUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm py-2.5 px-4 rounded">{error}</div>
      )}
      <input type="hidden" name="imageUrl" value={fields.imageUrl ?? ""} />

      <Field label="ISBN">
        <div className="flex gap-2">
          <input
            ref={isbnRef}
            name="isbn"
            required
            defaultValue={fields.isbn ?? ""}
            className="input-clean flex-1"
            placeholder="9780140328721"
          />
          <button
            type="button"
            onClick={handleIsbnLookup}
            disabled={fetching}
            className="px-4 py-2 border border-default rounded text-sm text-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
          >
            {fetching ? "..." : "Hent info"}
          </button>
        </div>
      </Field>

      <Field label="Tittel">
        <input name="title" required key={fields.title} defaultValue={fields.title ?? ""} className="input-clean" />
      </Field>
      <Field label="Forfatter">
        <input name="author" required key={fields.author} defaultValue={fields.author ?? ""} className="input-clean" />
      </Field>
      <Field label="Beskrivelse">
        <textarea name="description" required className="input-clean resize-none" rows={3} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Pris (kr)">
          <input name="price" type="number" step="0.01" required className="input-clean" />
        </Field>
        <Field label="Lager">
          <input name="stock" type="number" min="0" required className="input-clean" />
        </Field>
      </div>
      <Field label="Kategori">
        <input name="category" required className="input-clean" />
      </Field>
      <Field label="Bilde (valgfritt)">
        {preview && (
          <img src={preview} alt="Preview" className="w-full h-48 object-contain rounded-md mb-3 bg-[var(--accent-soft)]/30 p-3" />
        )}
        <input
          name="imageFile"
          type="file"
          accept="image/*"
          className="block w-full text-sm text-muted file:mr-3 file:px-4 file:py-2 file:border-0 file:bg-accent-soft file:text-accent file:rounded file:font-medium file:cursor-pointer hover:file:bg-accent hover:file:text-white file:transition-colors"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
            else setPreview(fields.imageUrl ?? null);
          }}
        />
        <p className="text-xs text-muted-soft mt-2">Last opp en fil, eller la feltet være tomt for å bruke omslaget fra Open Library.</p>
      </Field>

      <button type="submit" className="btn-accent py-3 rounded text-sm font-medium mt-2">
        Opprett bok
      </button>
    </form>
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
