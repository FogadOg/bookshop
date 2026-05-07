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

export type CreateOrderResult =
  | { ok: true }
  | { ok: false; error: string; adjustments?: { bookId: string; available: number }[] };

export async function createOrder(items: CartItem[], formData: FormData): Promise<CreateOrderResult> {
  const customerName = formData.get("customerName") as string;
  const customerEmail = formData.get("customerEmail") as string;
  const streetAddress = (formData.get("streetAddress") as string)?.trim();
  const postalCode = (formData.get("postalCode") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const country = (formData.get("country") as string)?.trim();
  const discountCodeInput = (formData.get("discountCode") as string)?.trim().toUpperCase();

  if (items.length === 0) {
    return { ok: false, error: "Handlekurven er tom." };
  }

  if (items.some((i) => !Number.isInteger(i.quantity) || i.quantity < 1)) {
    return { ok: false, error: "Ugyldig antall i handlekurven." };
  }

  const bookIds = items.map((i) => i.bookId);
  const books = await prisma.book.findMany({ where: { id: { in: bookIds } } });

  const missingBook = items.find((i) => !books.find((b) => b.id === i.bookId));
  if (missingBook) {
    return {
      ok: false,
      error: "En av bøkene i handlekurven finnes ikke lenger. Oppdater handlekurven og prøv igjen.",
    };
  }

  const adjustments: { bookId: string; available: number }[] = [];
  for (const item of items) {
    const book = books.find((b) => b.id === item.bookId)!;
    if (item.quantity > book.stock) {
      adjustments.push({ bookId: book.id, available: book.stock });
    }
  }
  if (adjustments.length > 0) {
    return {
      ok: false,
      error: "Det er ikke nok på lager for noen av bøkene. Antall har blitt justert i handlekurven.",
      adjustments,
    };
  }

  const subtotal = items.reduce((sum, item) => {
    const book = books.find((b) => b.id === item.bookId)!;
    return sum + book.price * item.quantity;
  }, 0);

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
        streetAddress,
        postalCode,
        city,
        country,
        total,
        discountCode: discountPercent > 0 ? discountCodeInput : null,
        discountPercent: discountPercent > 0 ? discountPercent : null,
        items: {
          create: items.map((i) => {
            const book = books.find((b) => b.id === i.bookId)!;
            return { bookId: i.bookId, quantity: i.quantity, price: book.price };
          }),
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

  sendOrderConfirmation({
    to: customerEmail,
    customerName,
    orderId: order.id,
    items: items.map((i) => {
      const book = books.find((b) => b.id === i.bookId)!;
      return { title: book.title, quantity: i.quantity, price: book.price };
    }),
    total,
    discountCode: discountPercent > 0 ? discountCodeInput : null,
    discountPercent: discountPercent > 0 ? discountPercent : null,
  }).catch((err) => console.error("Failed to send order confirmation email:", err));

  redirect(`/order-confirmation/${order.id}`);
}

export async function validateDiscountCode(code: string): Promise<number | null> {
  const discount = await prisma.discountCode.findFirst({
    where: { code: code.trim().toUpperCase(), active: true },
  });
  return discount ? discount.percent : null;
}
