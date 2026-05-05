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
    <main className="w-full sm:max-w-2xl sm:mx-auto px-[10px] sm:px-6 py-10 w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success text-3xl mb-4">✓</div>
        <h1 className="text-2xl font-bold">Bestilling bekreftet!</h1>
        <p className="text-gray-400 text-sm mt-1">Ordrenummer: <span className="font-mono">{order.id.slice(-8).toUpperCase()}</span></p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-4">
        <h2 className="font-semibold mb-3">Leveringsinfo</h2>
        <div className="text-sm text-gray-600 flex flex-col gap-1">
          <p className="font-medium text-gray-900">{order.customerName}</p>
          <p>{order.customerEmail}</p>
          <p className="text-gray-500">{order.address}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-4">
        <h2 className="font-semibold mb-3">Bestilte bøker</h2>
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
        <div className="flex justify-between gap-4 font-bold text-base">
          <span>Totalt inkl. mva</span>
          <span className="whitespace-nowrap">{formatPrice(order.total)} kr</span>
        </div>
      </div>

      <ClearCart />

      <Link href="/" className="btn btn-outline w-full mt-2">
        Fortsett å handle
      </Link>
    </main>
  );
}
