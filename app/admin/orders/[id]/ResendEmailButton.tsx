"use client";

import { useState } from "react";

export default function ResendEmailButton({
  defaultEmail,
  resendEmail,
}: {
  defaultEmail: string;
  resendEmail: (email: string) => Promise<string | null>;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSend() {
    setSending(true);
    setResult(null);
    const error = await resendEmail(email.trim());
    setSending(false);
    if (error) {
      setResult({ ok: false, message: error });
    } else {
      setResult({ ok: true, message: "E-post sendt!" });
    }
  }

  function handleClose() {
    setOpen(false);
    setEmail(defaultEmail);
    setResult(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full py-2.5 border border-default text-[var(--foreground)] rounded text-sm font-medium hover:border-accent hover:text-accent transition-colors"
      >
        Send ordrebekreftelse på nytt
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
          <div className="relative bg-surface border border-default rounded-md p-6 w-full max-w-md shadow-xl">
            <h2 className="text-base font-semibold mb-1">Send ordrebekreftelse</h2>
            <p className="text-sm text-muted mb-5">
              E-posten sendes til adressen nedenfor. Du kan endre den om nødvendig.
            </p>

            <label className="block mb-4">
              <span className="text-sm text-[var(--foreground)] mb-1.5 block">E-postadresse</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-clean w-full"
              />
            </label>

            {result && (
              <div
                className={`text-sm py-2.5 px-4 rounded mb-4 ${
                  result.ok
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {result.message}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 border border-default text-[var(--foreground)] rounded text-sm font-medium hover:border-accent hover:text-accent transition-colors"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || !email.trim()}
                className="flex-1 btn-accent py-2.5 rounded text-sm font-medium disabled:opacity-50"
              >
                {sending ? "Sender..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
