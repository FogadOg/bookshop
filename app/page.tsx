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
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Bokhandelen</h1>

      <form method="GET" className="mb-8">
        <div className="join">
          <input
            className="input join-item"
            name="q"
            placeholder="Søk..."
            defaultValue={q ?? ""}
          />
          <select name="category" defaultValue={category ?? ""} className="select join-item">
            <option value="">Alle kategorier</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button className="btn join-item btn-neutral" type="submit">Søk</button>
        </div>
      </form>

      {books.length === 0 ? (
        <p className="text-gray-500">Ingen bøker funnet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </main>
  );
}
