import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClearCart from "./ClearCart";

export default async function OrdreBekreftelserPage({
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
    <main className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold">Bestilling bekreftet!</h1>
        <p className="text-gray-500 mt-2">Ordrenummer: {order.id}</p>
      </div>

      <div className="border rounded-lg p-4 bg-white mb-4">
        <h2 className="font-semibold mb-3">Leveringsinfo</h2>
        <p className="text-sm">{order.customerName}</p>
        <p className="text-sm">{order.customerEmail}</p>
        <p className="text-sm">{order.address}</p>
      </div>

      <div className="border rounded-lg p-4 bg-white mb-4">
        <h2 className="font-semibold mb-3">Bestilte bøker</h2>
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

      <ClearCart />

      <Link href="/" className="btn btn-outline w-full mt-2">
        Fortsett å handle
      </Link>
    </main>
  );
}
