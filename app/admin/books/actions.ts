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

async function downloadImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const ext = contentType.split("/")[1]?.split(";")[0] ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch {
    return null;
  }
}

export async function createBook(formData: FormData): Promise<string | null> {
  const imageFile = formData.get("imageFile") as File;
  const externalUrl = formData.get("imageUrl") as string;
  const imageUrl =
    (await saveImage(imageFile)) ??
    (externalUrl ? await downloadImage(externalUrl) : null);

  try {
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
  } catch (e: any) {
    if (e?.code === "P2002") return "A book with this ISBN already exists.";
    return "Something went wrong. Please try again.";
  }
  redirect("/admin");
}

export async function updateBook(id: string, formData: FormData) {
  const imageFile = formData.get("imageFile") as File;
  const externalUrl = formData.get("imageUrl") as string;
  const imageUrl =
    (await saveImage(imageFile)) ??
    (externalUrl?.startsWith("http") ? await downloadImage(externalUrl) : externalUrl || null);

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
