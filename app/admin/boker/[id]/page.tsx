import { prisma } from "../../../../lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function RedigerBokPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

  async function update(formData: FormData) {
    "use server";
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
      },
    });
    redirect("/admin");
  }

  async function remove() {
    "use server";
    await prisma.book.delete({ where: { id } });
    redirect("/admin");
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="btn btn-ghost btn-sm">← Tilbake</Link>
        <h1 className="text-2xl font-bold">Rediger bok</h1>
      </div>
      <form action={update} className="flex flex-col gap-4 bg-white p-6 rounded-lg border">
        <div>
          <label className="label"><span className="label-text font-medium">Tittel</span></label>
          <input name="title" required defaultValue={book.title} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text font-medium">Forfatter</span></label>
          <input name="author" required defaultValue={book.author} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text font-medium">Beskrivelse</span></label>
          <textarea name="description" required defaultValue={book.description} className="textarea textarea-bordered w-full" rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label"><span className="label-text font-medium">Pris (kr)</span></label>
            <input name="price" type="number" step="0.01" required defaultValue={book.price} className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label"><span className="label-text font-medium">Lagerstatus</span></label>
            <input name="stock" type="number" min="0" required defaultValue={book.stock} className="input input-bordered w-full" />
          </div>
        </div>
        <div>
          <label className="label"><span className="label-text font-medium">ISBN</span></label>
          <input name="isbn" required defaultValue={book.isbn} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text font-medium">Kategori</span></label>
          <input name="category" required defaultValue={book.category} className="input input-bordered w-full" />
        </div>
        <button type="submit" className="btn btn-neutral mt-2">Lagre endringer</button>
      </form>

      <form action={remove} className="mt-4">
        <button type="submit" className="btn btn-error w-full">Slett bok</button>
      </form>
    </main>
  );
}
