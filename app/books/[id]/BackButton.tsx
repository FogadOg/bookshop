"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-1.5"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
        <path d="M7.5 9.5L4 6L7.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Tilbake
    </button>
  );
}
