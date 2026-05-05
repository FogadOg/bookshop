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

const statusColor: Record<string, string> = {
  NY: "badge-info",
  BEHANDLES: "badge-warning",
  SENDT: "badge-success",
  KANSELLERT: "badge-error",
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
    <main className="w-full sm:max-w-2xl sm:mx-auto px-[10px] sm:px-6 py-10 w-full">
      <div className="mb-8">
        <Link href="/admin/orders" className="btn btn-outline btn-sm mb-4">Tilbake</Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ordre detaljer</h1>
            <p className="text-sm text-gray-400 font-mono mt-0.5">{order.id.slice(-8).toUpperCase()}</p>
          </div>
          <span className={`badge ${statusColor[order.status]}`}>
            {statusLabel[order.status]}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-4">
        <h2 className="font-semibold mb-3">Kundeinfo</h2>
        <div className="text-sm flex flex-col gap-1">
          <p className="font-medium text-gray-900">{order.customerName}</p>
          <p className="text-gray-500">{order.customerEmail}</p>
          <p className="text-gray-500">{order.address}</p>
          <p className="text-gray-400 text-xs mt-1">{order.createdAt.toLocaleDateString("nb-NO")}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-4">
        <h2 className="font-semibold mb-3">Bøker</h2>
        <div className="flex flex-col gap-1">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.book.title} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)} kr</span>
            </div>
          ))}
        </div>
        <div className="divider my-3" />
        {order.discountCode && (
          <div className="flex justify-between text-sm text-success font-medium mb-2">
            <span>Rabatt ({order.discountCode} – {order.discountPercent}%)</span>
            <span>Inkludert</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base">
          <span>Totalt inkl. mva</span>
          <span>{formatPrice(order.total)} kr</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <h2 className="font-semibold mb-3">Oppdater status</h2>
        <StatusForm currentStatus={order.status} updateStatus={updateStatus} />
      </div>
    </main>
  );
}
