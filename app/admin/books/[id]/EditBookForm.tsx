"use client";

import { useRef, useState } from "react";
import { Book } from "@prisma/client";
import { updateBook, deleteBook, setBookArchived } from "../actions";

async function fetchBookByIsbn(isbn: string) {
  const res = await fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`
  );
  const data = await res.json();
  const book = data[`ISBN:${isbn}`];
  if (!book) return null;
  return {
    title: book.title ?? "",
    author: book.authors?.[0]?.name ?? "",
    imageUrl: book.cover?.large ?? book.cover?.medium ?? "",
  };
}

export default function EditBookForm({ book }: { book: Book }) {
  const [preview, setPreview] = useState<string | null>(book.imageUrl ?? null);
  const [fetching, setFetching] = useState(false);
  const [fetched, setFetched] = useState<{ title: string; author: string; imageUrl: string } | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isbn, setIsbn] = useState(book.isbn);
  const isbnRef = useRef<HTMLInputElement>(null);

  const update = updateBook.bind(null, book.id);

  async function handleDelete() {
    if (!confirm("Er du sikker på at du vil slette denne boken?")) return;
    const result = await deleteBook(book.id);
    if (result) setDeleteError(result);
  }

  function handleRemoveImage() {
    setPreview(null);
    setImageRemoved(true);
    setFetched((prev) => prev ? { ...prev, imageUrl: "" } : prev);
    setFileInputKey((k) => k + 1);
  }

  const currentImageUrl = imageRemoved
    ? ""
    : fetched?.imageUrl ?? book.imageUrl ?? "";

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
    setFetched(result);
    setFetchCount((c) => c + 1);
    if (result.imageUrl) {
      setPreview(result.imageUrl);
      setImageRemoved(false);
    }
  }

  return (
    <>
      <form action={update} className="flex flex-col gap-6 mb-12">
        <input type="hidden" name="imageUrl" value={currentImageUrl} />

        <Field label="ISBN">
          <div className="flex gap-2">
            <input
              ref={isbnRef}
              name="isbn"
              required
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="input-clean flex-1"
            />
            <button
              type="button"
              onClick={handleIsbnLookup}
              disabled={fetching || !isbn.trim()}
              className={
                isbn.trim()
                  ? "btn-accent px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
                  : "px-4 py-2 border border-default rounded text-sm text-muted transition-colors disabled:opacity-50"
              }
            >
              {fetching ? "..." : "Hent info"}
            </button>
          </div>
        </Field>

        <Field label="Tittel">
          <input name="title" required key={`title-${fetchCount}`} defaultValue={fetched?.title ?? book.title} className="input-clean" />
        </Field>
        <Field label="Forfatter">
          <input name="author" required key={`author-${fetchCount}`} defaultValue={fetched?.author ?? book.author} className="input-clean" />
        </Field>
        <Field label="Beskrivelse">
          <textarea name="description" required defaultValue={book.description} className="input-clean resize-none" rows={3} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Pris (kr)">
            <input name="price" type="number" step="0.01" required defaultValue={book.price} className="input-clean" />
          </Field>
          <Field label="Lager">
            <input name="stock" type="number" min="0" required defaultValue={book.stock} className="input-clean" />
          </Field>
        </div>
        <Field label="Kategori">
          <input name="category" required defaultValue={book.category} className="input-clean" />
        </Field>
        <Field label="Bilde (valgfritt)">
          {preview && (
            <div className="relative mb-3">
              <img src={preview} alt="Preview" className="w-full h-48 object-contain rounded-md bg-[var(--accent-soft)]/30 p-3" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-surface border border-default rounded-full w-8 h-8 flex items-center justify-center text-sm text-muted hover:text-red-700 hover:border-red-300 transition-colors"
                aria-label="Fjern bilde"
              >
                ×
              </button>
            </div>
          )}
          <input
            key={fileInputKey}
            name="imageFile"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-muted file:mr-3 file:px-4 file:py-2 file:border-0 file:bg-accent-soft file:text-accent file:rounded file:font-medium file:cursor-pointer hover:file:bg-accent hover:file:text-white file:transition-colors"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
                setImageRemoved(false);
              } else {
                setPreview(currentImageUrl || null);
              }
            }}
          />
          <p className="text-xs text-muted-soft mt-2">Last opp en fil, eller la feltet være tomt for å bruke omslaget fra Open Library.</p>
        </Field>

        <button type="submit" className="btn-accent py-3 rounded text-sm font-medium mt-2">
          Lagre endringer
        </button>
      </form>

      <div className="border border-soft rounded-md p-6 bg-surface mb-4">
        <h2 className="text-sm uppercase tracking-wider text-muted mb-1">
          {book.archived ? "Arkivert" : "Arkiver"}
        </h2>
        <p className="text-sm text-muted mb-4">
          {book.archived
            ? "Boken er skjult fra butikken. Tidligere ordre er ikke påvirket."
            : "Skjul boken fra butikken uten å slette den. Tidligere ordre forblir intakte."}
        </p>
        <form action={setBookArchived.bind(null, book.id, !book.archived)}>
          <button
            type="submit"
            className="w-full py-2.5 border border-default text-[var(--foreground)] rounded text-sm font-medium hover:border-accent hover:text-accent transition-colors"
          >
            {book.archived ? "Gjenopprett bok" : "Arkiver bok"}
          </button>
        </form>
      </div>

      <div className="border border-soft rounded-md p-6 bg-surface">
        <h2 className="text-sm uppercase tracking-wider text-red-700 mb-1">Faresone</h2>
        <p className="text-sm text-muted mb-4">Dette kan ikke angres.</p>
        {deleteError && (
          <div className="bg-red-50 text-red-700 text-sm py-2.5 px-4 rounded mb-3">{deleteError}</div>
        )}
        <button
          type="button"
          onClick={handleDelete}
          className="w-full py-2.5 border border-red-200 text-red-700 rounded text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Slett bok
        </button>
      </div>
    </>
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
