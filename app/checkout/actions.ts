"use server";

import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import { sendOrderConfirmation } from "../../lib/mailer";

type CartItem = {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  stock: number;
};

export async function createOrder(items: CartItem[], formData: FormData) {
  const customerName = formData.get("customerName") as string;
  const customerEmail = formData.get("customerEmail") as string;
  const address = formData.get("address") as string;
  const discountCodeInput = (formData.get("discountCode") as string)?.trim().toUpperCase();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discountPercent = 0;
  if (discountCodeInput) {
    const code = await prisma.discountCode.findFirst({
      where: { code: discountCodeInput, active: true },
    });
    if (code) discountPercent = code.percent;
  }

  const discounted = subtotal * (1 - discountPercent / 100);
  const total = Math.round(discounted * 1.25 * 100) / 100;

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        customerName,
        customerEmail,
        address,
        total,
        discountCode: discountPercent > 0 ? discountCodeInput : null,
        discountPercent: discountPercent > 0 ? discountPercent : null,
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

  // Fire and forget — do not await so redirect happens immediately
  sendOrderConfirmation({
    to: customerEmail,
    customerName,
    orderId: order.id,
    items: items.map((i) => ({ title: i.title, quantity: i.quantity, price: i.price })),
    total,
    discountCode: discountPercent > 0 ? discountCodeInput : null,
    discountPercent: discountPercent > 0 ? discountPercent : null,
  }).catch((err) => console.error("Failed to send order confirmation email:", err));

  redirect(`/ordre-bekreftelse/${order.id}`);
}

export async function validateDiscountCode(code: string): Promise<number | null> {
  const discount = await prisma.discountCode.findFirst({
    where: { code: code.trim().toUpperCase(), active: true },
  });
  return discount ? discount.percent : null;
}
