import { prisma } from "../lib/prisma";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string }>;
}) {
  const { q, kategori } = await searchParams;

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
          kategori ? { category: kategori } : {},
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
          <select name="kategori" className="select join-item">
            <option value="">Alle kategorier</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} selected={cat === kategori}>
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
            <div key={book.id} className="card card-bordered bg-base-100 shadow-sm">
              <div className="card-body gap-1">
                <span className="badge badge-ghost badge-sm">{book.category}</span>
                <h2 className="card-title text-base">{book.title}</h2>
                <p className="text-sm text-gray-500">{book.author}</p>
                <p className="text-sm text-gray-400 flex-1">{book.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold">{book.price} kr</span>
                  <span className="text-xs text-gray-400">Lager: {book.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
