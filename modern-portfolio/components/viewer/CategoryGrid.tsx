import { getCategoryIcon } from "@/lib/portfolio/category-icon";
import type { Category } from "@/lib/types/portfolio";
import Link from "next/link";

type Props = {
  categories: Category[];
};

export function CategoryGrid({ categories }: Props) {
  if (categories.length === 0) return null;

  return (
    <section
      id="categories"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14"
      aria-labelledby="categories-heading"
    >
      <h2
        id="categories-heading"
        className="mb-8 text-center text-2xl font-semibold text-[#212529] sm:text-3xl"
      >
        Project Categories
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.slug, cat.icon);
          return (
            <div
              key={cat.id}
              className="h-full rounded-lg border border-black/[0.06] bg-white shadow-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-md"
            >
              <div className="flex h-full flex-col items-center px-6 py-10 text-center">
                <Icon
                  className="mb-4 size-14 text-[#0d6efd]"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <h3 className="text-lg font-semibold text-[#212529]">
                  {cat.name}
                </h3>
                <Link
                  href={`/category/${encodeURIComponent(cat.slug)}`}
                  className="mt-5 inline-flex items-center justify-center rounded-md border-2 border-[#0d6efd] bg-transparent px-4 py-2 text-sm font-semibold text-[#0d6efd] no-underline transition-colors hover:bg-[#0d6efd] hover:text-white"
                >
                  Explore
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
