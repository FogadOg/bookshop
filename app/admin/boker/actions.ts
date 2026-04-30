"use server";

import { prisma } from "../../../lib/prisma";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import path from "path";

async function saveImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(process.cwd(), "public", "uploads", filename);
  await writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

export async function createBook(formData: FormData) {
  const imageFile = formData.get("imageFile") as File;
  const existingImageUrl = formData.get("imageUrl") as string;
  const imageUrl = await saveImage(imageFile) ?? (existingImageUrl || null);

  await prisma.book.create({
    data: {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      isbn: formData.get("isbn") as string,
      stock: parseInt(formData.get("stock") as string),
      category: formData.get("category") as string,
      imageUrl,
    },
  });
  redirect("/admin");
}

export async function updateBook(id: string, formData: FormData) {
  const imageFile = formData.get("imageFile") as File;
  const existingImageUrl = formData.get("imageUrl") as string;
  const uploaded = await saveImage(imageFile);
  const imageUrl = uploaded ?? (existingImageUrl || null);

  await prisma.book.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      isbn: formData.get("isbn") as string,
      stock: parseInt(formData.get("stock") as string),
      category: formData.get("category") as string,
      imageUrl,
    },
  });
  redirect("/admin");
}

export async function deleteBook(id: string) {
  await prisma.book.delete({ where: { id } });
  redirect("/admin");
}
