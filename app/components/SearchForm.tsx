"use client";

import { useState } from "react";

export default function SearchForm({
  q,
  category,
  categories,
}: {
  q: string;
  category: string;
  categories: string[];
}) {
  const [selected, setSelected] = useState(category);

  const label = selected
    ? categories.find((c) => c === selected) ?? "Alle kategorier"
    : "Alle kategorier";

  return (
    <form method="GET" className="mb-10 flex flex-col sm:flex-row justify-center gap-2 sm:gap-0">
      <input type="hidden" name="category" value={selected} />
      <div className="flex items-stretch border border-gray-200 rounded-lg shadow-sm w-full sm:w-fit">
        <input
          className="px-3 py-2 flex-1 sm:w-80 bg-white border-none outline-none text-sm rounded-l-lg min-w-0"
          name="q"
          placeholder="Søk etter tittel eller forfatter..."
          defaultValue={q}
        />
        <div className="w-px bg-gray-200 self-stretch" />
        <details className="dropdown dropdown-end">
          <summary className="px-3 py-2 bg-white text-sm cursor-pointer list-none flex items-center gap-2 w-36 shrink-0">
            <span className="truncate">{label}</span>
            <svg className="ml-auto w-3 h-3 opacity-50 shrink-0" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </summary>
          <ul className="menu dropdown-content bg-white rounded-box z-10 w-44 p-2 shadow-sm border border-gray-100 text-gray-800">
            <li>
              <a onClick={() => setSelected("")} className={!selected ? "active" : ""}>
                Alle kategorier
              </a>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <a onClick={() => setSelected(cat)} className={selected === cat ? "active" : ""}>
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </details>
        <div className="w-px bg-gray-200 self-stretch" />
        <button className="btn btn-neutral rounded-l-none rounded-r-lg shrink-0" type="submit">Søk</button>
      </div>
    </form>
  );
}
