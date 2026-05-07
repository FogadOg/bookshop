import { prisma } from "../../../../lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { auth } from "../../../../auth";
import StatusForm from "./StatusForm";
import { formatPrice } from "../../../../lib/format";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  NY: "Ny",
  BEHANDLES: "Behandles",
  SENDT: "Sendt",
  KANSELLERT: "Kansellert",
};

const statusStyle: Record<string, string> = {
  NY: "bg-blue-50 text-blue-700",
  BEHANDLES: "bg-amber-50 text-amber-700",
  SENDT: "bg-emerald-50 text-emerald-700",
  KANSELLERT: "bg-red-50 text-red-700",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { book: true } } },
  });
  if (!order) notFound();

  async function updateStatus(formData: FormData) {
    "use server";
    const status = formData.get("status") as OrderStatus;
    await prisma.order.update({ where: { id }, data: { status } });
    redirect(`/admin/orders/${id}`);
  }

  return (
    <main className="w-full sm:max-w-3xl sm:mx-auto px-4 sm:px-8 py-12 sm:py-14">
      <Link
        href="/admin/orders"
        className="text-sm text-muted hover:text-accent transition-colors mb-6 inline-flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 9.5L4 6L7.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Tilbake
      </Link>

      <div className="mb-10 pb-6 border-b border-soft flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">Ordre</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-muted text-sm mt-1">{order.createdAt.toLocaleDateString("nb-NO")}</p>
        </div>
        <span className={`text-[11px] uppercase tracking-wider font-medium px-2.5 py-1 rounded ${statusStyle[order.status]}`}>
          {statusLabel[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Section title="Kunde">
          <p className="font-medium text-[var(--foreground)]">{order.customerName}</p>
          <p className="text-muted text-sm">{order.customerEmail}</p>
        </Section>
        <Section title="Leveringsadresse">
          <div className="text-sm text-[var(--foreground)] space-y-0.5">
            <p>{order.streetAddress}</p>
            <p>{order.postalCode} {order.city}</p>
            <p>{order.country}</p>
          </div>
        </Section>
      </div>

      <Section title="Bøker" className="mb-6">
        <div className="flex flex-col gap-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-[var(--foreground)] truncate pr-3">
                {item.book.title} <span className="text-muted">× {item.quantity}</span>
              </span>
              <span className="shrink-0">{formatPrice(item.price * item.quantity * 1.25)} kr</span>
            </div>
          ))}
        </div>
        {order.discountCode && (
          <div className="flex justify-between text-sm text-accent font-medium border-t border-soft pt-3 mb-1">
            <span>Rabatt ({order.discountCode} – {order.discountPercent}%)</span>
            <span>Inkludert</span>
          </div>
        )}
        <div className="border-t border-soft pt-3 mt-1 flex justify-between items-baseline">
          <span className="font-medium">Totalt inkl. mva</span>
          <span className="text-xl font-semibold">{formatPrice(order.total)} kr</span>
        </div>
      </Section>

      <Section title="Oppdater status">
        <StatusForm currentStatus={order.status} updateStatus={updateStatus} />
      </Section>
    </main>
  );
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-soft rounded-md p-6 bg-surface ${className}`}>
      <h2 className="text-sm uppercase tracking-wider text-muted mb-4">{title}</h2>
      {children}
    </div>
  );
}
