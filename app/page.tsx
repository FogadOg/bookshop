import { prisma } from "../lib/prisma";

export default async function Home() {
  const books = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Bokhandelen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="border rounded-lg p-4 flex flex-col gap-2">
            <span className="text-xs text-gray-500 uppercase">{book.category}</span>
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-500 flex-1">{book.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold">{book.price} kr</span>
              <span className="text-xs text-gray-400">Lager: {book.stock}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
