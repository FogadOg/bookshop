import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClearCart from "./ClearCart";
import { formatPrice } from "../../../lib/format";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { book: true } } },
  });

  if (!order) notFound();

  return (
    <main className="w-full sm:max-w-2xl sm:mx-auto px-4 sm:px-8 py-12 sm:py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-soft text-accent text-2xl mb-6">✓</div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">Bekreftet</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">Takk for bestillingen</h1>
        <p className="text-muted">
          Ordrenummer: <span className="font-mono text-[var(--foreground)]">{order.id.slice(-8).toUpperCase()}</span>
        </p>
      </div>

      <div className="border border-soft rounded-md p-6 mb-4 bg-surface">
        <h2 className="text-sm uppercase tracking-wider text-muted mb-3">Leveringsinfo</h2>
        <div className="text-sm flex flex-col gap-1">
          <p className="font-medium text-[var(--foreground)]">{order.customerName}</p>
          <p className="text-muted">{order.customerEmail}</p>
          <p className="text-muted whitespace-pre-line">{order.address}</p>
        </div>
      </div>

      <div className="border border-soft rounded-md p-6 mb-8 bg-surface">
        <h2 className="text-sm uppercase tracking-wider text-muted mb-4">Bestilte bøker</h2>
        <div className="flex flex-col gap-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-[var(--foreground)] truncate pr-3">
                {item.book.title} <span className="text-muted">× {item.quantity}</span>
              </span>
              <span className="text-[var(--foreground)] shrink-0">{formatPrice(item.price * item.quantity * 1.25)} kr</span>
            </div>
          ))}
        </div>
        {order.discountCode && (
          <div className="flex justify-between text-sm text-accent font-medium border-t border-soft pt-3 mb-1">
            <span>Rabatt ({order.discountCode} – {order.discountPercent}%)</span>
            <span>Inkludert</span>
          </div>
        )}
        <div className="border-t border-soft pt-3 mt-1 flex justify-between items-baseline gap-4">
          <span className="font-medium">Totalt inkl. mva</span>
          <span className="text-2xl font-semibold whitespace-nowrap">{formatPrice(order.total)} kr</span>
        </div>
      </div>

      <ClearCart />

      <Link
        href="/"
        className="block w-full py-3 text-center text-sm font-medium border border-default rounded text-[var(--foreground)] hover:bg-accent-soft hover:border-accent hover:text-accent transition-colors"
      >
        Fortsett å handle
      </Link>
    </main>
  );
}
