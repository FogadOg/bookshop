"use client";

export default function CategoryDropdown({
  categories,
  current,
}: {
  categories: string[];
  current: string;
}) {
  function pick(value: string) {
    const input = document.getElementById("kategori-input") as HTMLInputElement;
    input.value = value;
    input.closest("form")!.submit();
  }

  return (
    <div className="dropdown dropdown-start">
      <div tabIndex={0} role="button" className="btn btn-outline">
        {current || "Alle kategorier"}
      </div>
      <ul tabIndex={-1} className="dropdown-content menu bg-white rounded-box z-10 w-52 p-2 shadow border border-gray-200">
        <li>
          <a onClick={() => pick("")}>Alle kategorier</a>
        </li>
        {categories.map((cat) => (
          <li key={cat}>
            <a onClick={() => pick(cat)}>{cat}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
