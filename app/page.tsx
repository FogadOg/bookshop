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
        archived: false,
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
      .findMany({
        where: { archived: false },
        select: { category: true },
        distinct: ["category"],
      })
      .then((rows) => rows.map((r) => r.category)),
  ]);

  return (
    <main className="w-full sm:max-w-6xl sm:mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <header className="mb-10 sm:mb-14 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">Norsk bokhandel</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05] mb-4">
          Bøker til gode lesestunder
        </h1>
        <p className="text-muted text-base leading-relaxed">
          Et nøye utvalgt sortiment av skjønnlitteratur, sakprosa og barnebøker — sendt rett hjem til deg.
        </p>
      </header>

      <SearchForm q={q ?? ""} category={category ?? ""} categories={categories} />

      <div className="min-h-[60vh]">
        {books.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg text-[var(--foreground)] mb-1">Ingen bøker funnet</p>
            <p className="text-sm text-muted">Prøv et annet søk eller kategori</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 items-stretch">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
