import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

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

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <main className="w-full sm:max-w-6xl sm:mx-auto px-4 sm:px-8 py-12 sm:py-14">
      <Link
        href="/admin"
        className="text-sm text-muted hover:text-accent transition-colors mb-6 inline-flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 9.5L4 6L7.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Tilbake
      </Link>

      <div className="mb-10 pb-6 border-b border-soft">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">Admin</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Ordre</h1>
        <p className="text-muted mt-1">{orders.length} totalt</p>
      </div>

      {orders.length === 0 && (
        <p className="text-center text-muted py-16">Ingen ordre ennå</p>
      )}

      {/* Mobile cards */}
      <div className="flex flex-col divide-y divide-[var(--border-soft)] border-y border-soft sm:hidden">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="py-4 flex flex-col gap-1.5 hover:opacity-70 transition-opacity"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-[var(--foreground)] truncate">{order.customerName}</p>
              <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ${statusStyle[order.status]} shrink-0`}>
                {statusLabel[order.status]}
              </span>
            </div>
            <p className="text-sm text-muted truncate">{order.customerEmail}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-soft">{order.createdAt.toLocaleDateString("nb-NO")} · {order._count.items} bøker</span>
              <span className="font-medium">{Number(order.total).toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-default">
              <th className="py-3 font-medium">Kunde</th>
              <th className="py-3 font-medium">E-post</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium text-right">Bøker</th>
              <th className="py-3 font-medium text-right">Totalt</th>
              <th className="py-3 font-medium text-right">Dato</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-soft)]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[var(--accent-soft)]/20 transition-colors group">
                <td className="py-3.5 font-medium">{order.customerName}</td>
                <td className="py-3.5 text-muted">{order.customerEmail}</td>
                <td className="py-3.5">
                  <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ${statusStyle[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                </td>
                <td className="py-3.5 text-right text-muted">{order._count.items}</td>
                <td className="py-3.5 text-right">{Number(order.total).toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr</td>
                <td className="py-3.5 text-right text-muted-soft">{order.createdAt.toLocaleDateString("nb-NO")}</td>
                <td className="py-3.5 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    style={{ color: "var(--accent)" }}
                    className="text-sm hover:underline"
                  >
                    Se detaljer
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
