"use server";

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDiscountCode(formData: FormData) {
  const code = (formData.get("code") as string).trim().toUpperCase();
  const percent = parseInt(formData.get("percent") as string, 10);

  if (!code || isNaN(percent) || percent < 1 || percent > 100) return;

  await prisma.discountCode.create({ data: { code, percent } });
  revalidatePath("/admin/discount-codes");
}

export async function toggleDiscountCode(id: string, active: boolean) {
  await prisma.discountCode.update({ where: { id }, data: { active } });
  revalidatePath("/admin/discount-codes");
}

export async function deleteDiscountCode(id: string) {
  await prisma.discountCode.delete({ where: { id } });
  revalidatePath("/admin/discount-codes");
}
