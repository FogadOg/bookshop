import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

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

export default async function OrdrePage() {
  const session = await auth();
  if (!session) redirect("/admin/logg-inn");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="btn btn-ghost btn-sm">← Tilbake</Link>
        <h1 className="text-2xl font-bold">Ordre</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="table bg-white">
          <thead>
            <tr>
              <th>Kunde</th>
              <th>E-post</th>
              <th>Totalt</th>
              <th>Antall bøker</th>
              <th>Status</th>
              <th>Dato</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-medium">{order.customerName}</td>
                <td>{order.customerEmail}</td>
                <td>{order.total} kr</td>
                <td>{order._count.items}</td>
                <td>
                  <span className={`badge badge-sm ${statusColor[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                </td>
                <td className="text-sm text-gray-500">
                  {order.createdAt.toLocaleDateString("nb-NO")}
                </td>
                <td>
                  <Link href={`/admin/ordre/${order.id}`} className="btn btn-ghost btn-xs">
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
