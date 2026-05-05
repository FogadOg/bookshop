import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../../auth";
import CreateBookForm from "./CreateBookForm";

export const dynamic = "force-dynamic";

export default async function NewBookPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="btn btn-ghost btn-sm">Tilbake</Link>
        <h1 className="text-2xl font-bold tracking-tight">Ny bok</h1>
      </div>
      <CreateBookForm />
    </main>
  );
}
