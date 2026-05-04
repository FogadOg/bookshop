import { prisma } from "../../../../lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../../auth";
import EditBookForm from "./EditBookForm";

export const dynamic = "force-dynamic";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/logg-inn");

  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="btn btn-ghost btn-sm">Back</Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit book</h1>
      </div>
      <EditBookForm book={book} />
    </main>
  );
}
