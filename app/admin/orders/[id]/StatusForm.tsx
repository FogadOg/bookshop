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
    <form action={updateStatus} className="flex gap-2 items-center">
      <input type="hidden" name="status" value={selected} />
      <details className="dropdown flex-1">
        <summary className="btn bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 w-full justify-between font-normal">
          {statusLabel[selected]}
          <svg className="w-3 h-3 opacity-50" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </summary>
        <ul className="menu dropdown-content bg-white rounded-box z-10 w-full p-2 border border-gray-100 text-gray-800">
          {Object.entries(statusLabel).map(([value, label]) => (
            <li key={value}>
              <a
                onClick={() => setSelected(value)}
                className={selected === value ? "active" : ""}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </details>
      <button type="submit" className="btn btn-neutral">Oppdater</button>
    </form>
  );
}
