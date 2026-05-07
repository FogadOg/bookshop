"use client";

import { useState } from "react";
import { deleteDiscountCode } from "./actions";
import ConfirmModal from "../../components/ConfirmModal";

export default function DeleteDiscountButton({ id, code }: { id: string; code: string }) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    await deleteDiscountCode(id);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-muted hover:text-red-600 transition-colors px-2 py-1"
      >
        Slett
      </button>

      <ConfirmModal
        open={open}
        title="Slett rabattkode"
        message={<>Er du sikker på at du vil slette koden <span className="font-mono font-medium text-[var(--foreground)]">{code}</span>? Dette kan ikke angres.</>}
        confirmLabel="Slett"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
