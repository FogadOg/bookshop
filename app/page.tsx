import { prisma } from "../lib/prisma";
import BookCard from "./components/BookCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const [books, categories] = await Promise.all([
    prisma.book.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { author: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
          category ? { category: category } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book
      .findMany({ select: { category: true }, distinct: ["category"] })
      .then((rows) => rows.map((r) => r.category)),
  ]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Bokhandelen</h1>

      <form method="GET" className="mb-10">
        <div className="join w-full max-w-2xl shadow-sm">
          <input
            className="input input-bordered join-item flex-1 focus:outline-none"
            name="q"
            placeholder="Søk etter tittel eller forfatter..."
            defaultValue={q ?? ""}
          />
          <select
            name="category"
            defaultValue={category ?? ""}
            className="select select-bordered join-item border-l-0 focus:outline-none"
          >
            <option value="">Alle kategorier</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button className="btn btn-neutral join-item px-6" type="submit">
            Søk
          </button>
        </div>
      </form>

      {books.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium">Ingen bøker funnet</p>
          <p className="text-sm mt-1">Prøv et annet søk eller kategori</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </main>
  );
}
