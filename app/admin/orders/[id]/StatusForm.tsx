"use client";

import { useState } from "react";

const statusLabel: Record<string, string> = {
  NY: "Ny",
  BEHANDLES: "Behandles",
  SENDT: "Sendt",
  KANSELLERT: "Kansellert",
};

export default function StatusForm({
  currentStatus,
  updateStatus,
}: {
  currentStatus: string;
  updateStatus: (formData: FormData) => Promise<void>;
}) {
  const [selected, setSelected] = useState(currentStatus);

  return (
    <form action={updateStatus} className="flex flex-col sm:flex-row gap-2">
      <input type="hidden" name="status" value={selected} />
      <details className="dropdown flex-1">
        <summary className="input-clean cursor-pointer list-none flex items-center justify-between">
          <span>{statusLabel[selected]}</span>
          <svg className="w-3 h-3 text-muted-soft ml-2" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </summary>
        <ul className="menu dropdown-content bg-surface rounded-md z-10 w-full p-1.5 mt-1 shadow-md border border-default text-[var(--foreground)]">
          {Object.entries(statusLabel).map(([value, label]) => (
            <li key={value}>
              <a
                onClick={() => setSelected(value)}
                className={`text-sm rounded ${selected === value ? "bg-accent-soft text-accent" : ""}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </details>
      <button type="submit" className="btn-accent px-5 py-2 rounded text-sm font-medium">
        Oppdater
      </button>
    </form>
  );
}
