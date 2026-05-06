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
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

  return (
    <main className="w-full sm:max-w-2xl sm:mx-auto px-4 sm:px-8 py-12 sm:py-14">
      <Link
        href="/admin"
        className="text-sm text-muted hover:text-accent transition-colors mb-6 inline-flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 9.5L4 6L7.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Tilbake
      </Link>
      <div className="mb-10 pb-6 border-b border-soft">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">Admin</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Rediger bok</h1>
      </div>
      <EditBookForm book={book} />
    </main>
  );
}
