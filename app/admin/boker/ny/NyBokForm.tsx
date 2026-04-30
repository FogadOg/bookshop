"use client";

import { useRef, useState } from "react";
import { createBook } from "../actions";

export default function NyBokForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={createBook} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-4">
      <div>
        <label className="label pt-0"><span className="label-text font-medium">Tittel</span></label>
        <input name="title" required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="label pt-0"><span className="label-text font-medium">Forfatter</span></label>
        <input name="author" required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="label pt-0"><span className="label-text font-medium">Beskrivelse</span></label>
        <textarea name="description" required className="textarea textarea-bordered w-full" rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label pt-0"><span className="label-text font-medium">Pris (kr)</span></label>
          <input name="price" type="number" step="0.01" required className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label pt-0"><span className="label-text font-medium">Lager</span></label>
          <input name="stock" type="number" min="0" required className="input input-bordered w-full" />
        </div>
      </div>
      <div>
        <label className="label pt-0"><span className="label-text font-medium">ISBN</span></label>
        <input name="isbn" required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="label pt-0"><span className="label-text font-medium">Kategori</span></label>
        <input name="category" required className="input input-bordered w-full" />
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
            else setPreview(null);
          }}
        />
      </div>
      <button type="submit" className="btn btn-neutral mt-2">Opprett bok</button>
    </form>
  );
}
