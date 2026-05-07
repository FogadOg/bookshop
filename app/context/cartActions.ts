"use server";

import { prisma } from "../../lib/prisma";

export type FreshBook = {
  id: string;
  title: string;
  price: number;
  stock: number;
};

export async function getFreshBooks(bookIds: string[]): Promise<FreshBook[]> {
  if (bookIds.length === 0) return [];
  const books = await prisma.book.findMany({
    where: { id: { in: bookIds } },
    select: { id: true, title: true, price: true, stock: true },
  });
  return books;
}
