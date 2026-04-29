"use server";

import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";

type CartItem = {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  stock: number;
};

export async function createOrder(
  items: CartItem[],
  formData: FormData
) {
  const customerName = formData.get("customerName") as string;
  const customerEmail = formData.get("customerEmail") as string;
  const address = formData.get("address") as string;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = Math.round(subtotal * 1.25 * 100) / 100;

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        customerName,
        customerEmail,
        address,
        total,
        items: {
          create: items.map((i) => ({
            bookId: i.bookId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    }),
    ...items.map((i) =>
      prisma.book.update({
        where: { id: i.bookId },
        data: { stock: { decrement: i.quantity } },
      })
    ),
  ]);

  redirect(`/ordre-bekreftelse/${order.id}`);
}
