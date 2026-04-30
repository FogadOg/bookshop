import { prisma } from "../../../../lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

const statusLabel: Record<string, string> = {
  NY: "Ny",
  BEHANDLES: "Behandles",
  SENDT: "Sendt",
  KANSELLERT: "Kansellert",
};

export default async function OrdreDetaljPage({
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

  async function updateStatus(formData: FormData) {
    "use server";
    const status = formData.get("status") as OrderStatus;
    await prisma.order.update({ where: { id }, data: { status } });
    redirect(`/admin/ordre/${id}`);
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/ordre" className="btn btn-ghost btn-sm">← Tilbake</Link>
        <h1 className="text-2xl font-bold">Ordre detaljer</h1>
      </div>

      <div className="border rounded-lg p-4 bg-white mb-4">
        <h2 className="font-semibold mb-2">Kundeinfo</h2>
        <p className="text-sm">{order.customerName}</p>
        <p className="text-sm">{order.customerEmail}</p>
        <p className="text-sm">{order.address}</p>
        <p className="text-xs text-gray-400 mt-1">
          {order.createdAt.toLocaleDateString("nb-NO")}
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-white mb-4">
        <h2 className="font-semibold mb-3">Bøker</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1">
            <span>{item.book.title} × {item.quantity}</span>
            <span>{Math.round(item.price * item.quantity * 100) / 100} kr</span>
          </div>
        ))}
        <div className="divider my-2" />
        <div className="flex justify-between font-bold">
          <span>Totalt inkl. mva</span>
          <span>{order.total} kr</span>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h2 className="font-semibold mb-3">Ordrestatus</h2>
        <form action={updateStatus} className="flex gap-2 items-center">
          <select name="status" defaultValue={order.status} className="select select-bordered flex-1">
            {Object.entries(statusLabel).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-neutral">Oppdater</button>
        </form>
      </div>
    </main>
  );
}
