"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchForm({
  q,
  category,
  categories,
}: {
  q: string;
  category: string;
  categories: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(category);
  const [query, setQuery] = useState(q);

  const label = selected
    ? categories.find((c) => c === selected) ?? "Alle kategorier"
    : "Alle kategorier";

  function navigate(q: string, cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q); else params.delete("q");
    if (cat) params.set("category", cat); else params.delete("category");
    router.push(`/?${params.toString()}`);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    navigate(value, selected);
  }

  function handleCategorySelect(cat: string) {
    setSelected(cat);
    navigate(query, cat);
  }

  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z" />
          </svg>
          <input
            className="input-clean"
            style={{ paddingLeft: "2.75rem" }}
            placeholder="Søk etter tittel eller forfatter..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>
        <details className="dropdown dropdown-end relative">
          <summary className="input-clean !pr-10 cursor-pointer list-none flex items-center justify-between gap-2 sm:w-52 hover:border-default transition-colors">
            <span className="truncate text-[var(--foreground)]">{label}</span>
            <svg className="absolute right-4 w-3 h-3 text-muted-soft" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </summary>
          <ul className="menu dropdown-content bg-surface rounded-md z-10 w-full sm:w-52 p-1.5 mt-1 shadow-md border border-default text-[var(--foreground)]">
            <li>
              <a onClick={() => handleCategorySelect("")} className={`text-sm rounded ${!selected ? "bg-accent-soft text-accent" : ""}`}>
                Alle kategorier
              </a>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <a onClick={() => handleCategorySelect(cat)} className={`text-sm rounded ${selected === cat ? "bg-accent-soft text-accent" : ""}`}>
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
