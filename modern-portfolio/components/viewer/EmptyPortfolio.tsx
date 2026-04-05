import { LayoutGrid, Sparkles } from "lucide-react";

type Props = {
  hasCategories: boolean;
};

export function EmptyPortfolio({ hasCategories }: Props) {
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      aria-labelledby="empty-portfolio-heading"
    >
      <div className="mx-auto max-w-lg rounded-xl border border-dashed border-[#ced4da] bg-white px-8 py-14 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#e7f1ff] text-[#0d6efd]">
          {hasCategories ? (
            <Sparkles className="size-7" strokeWidth={1.5} aria-hidden />
          ) : (
            <LayoutGrid className="size-7" strokeWidth={1.5} aria-hidden />
          )}
        </div>
        <h2
          id="empty-portfolio-heading"
          className="text-xl font-semibold text-[#212529]"
        >
          {hasCategories
            ? "No published projects yet"
            : "Portfolio is almost ready"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6c757d]">
          {hasCategories
            ? "Projects you publish from the admin dashboard will appear in the gallery here."
            : "Add categories and projects from the admin dashboard to populate this page."}
        </p>
      </div>
    </section>
  );
}
