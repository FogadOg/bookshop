import { prisma } from "../lib/prisma";
import BookCard from "./components/BookCard";
import SearchForm from "./components/SearchForm";

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
    <main className="max-w-5xl mx-auto px-6 py-10 w-full">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Bokhandelen</h1>

      <SearchForm q={q ?? ""} category={category ?? ""} categories={categories} />

      <div className="min-h-[60vh]">
        {books.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium">Ingen bøker funnet</p>
            <p className="text-sm mt-1">Prøv et annet søk eller kategori</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
