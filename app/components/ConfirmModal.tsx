"use client";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Bekreft",
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-surface border border-default rounded-md p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-base font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted mb-6">{message}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 border border-default text-[var(--foreground)] rounded text-sm font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded text-sm font-medium transition-colors ${
              destructive
                ? "bg-red-600 text-white hover:bg-red-700"
                : "btn-accent"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
