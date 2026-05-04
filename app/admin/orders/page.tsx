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

const statusColor: Record<string, string> = {
  NY: "badge-info",
  BEHANDLES: "badge-warning",
  SENDT: "badge-success",
  KANSELLERT: "badge-error",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="btn btn-ghost btn-sm">Tilbake</Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ordre</h1>
          <p className="text-sm text-gray-400 mt-0.5">{orders.length} totalt</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="table bg-white">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th>Kunde</th>
              <th>E-post</th>
              <th>Totalt</th>
              <th>Bøker</th>
              <th>Status</th>
              <th>Dato</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="font-medium">{order.customerName}</td>
                <td className="text-gray-500 text-sm">{order.customerEmail}</td>
                <td className="font-medium">{order.total} kr</td>
                <td className="text-gray-500">{order._count.items}</td>
                <td>
                  <span className={`badge badge-sm ${statusColor[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                </td>
                <td className="text-sm text-gray-400">
                  {order.createdAt.toLocaleDateString("nb-NO")}
                </td>
                <td>
                  <Link href={`/admin/orders/${order.id}`} className="btn btn-ghost btn-xs">
                    Se detaljer →
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-10">Ingen ordre ennå</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
