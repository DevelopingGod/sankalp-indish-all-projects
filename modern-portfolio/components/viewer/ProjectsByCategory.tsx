import type { Category, Project } from "@/lib/types/portfolio";
import { FolderOpen } from "lucide-react";
import { ProjectCard } from "./ProjectCard";

type Props = {
  categories: Category[];
  projects: Project[];
};

export function ProjectsByCategory({ categories, projects }: Props) {
  const byCategory = new Map<string, Project[]>();
  for (const p of projects) {
    const list = byCategory.get(p.category_id) ?? [];
    list.push(p);
    byCategory.set(p.category_id, list);
  }
  for (const [, list] of byCategory) {
    list.sort((a, b) => a.sort_order - b.sort_order);
  }

  return (
    <section
      id="projects"
      className="border-t border-[#dee2e6] bg-[#f8f9fa] py-12 sm:py-14"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="projects-heading"
          className="mb-10 text-center text-2xl font-semibold text-[#212529] sm:text-3xl"
        >
          Projects
        </h2>

        <div className="space-y-14">
          {categories.map((cat) => {
            const list = byCategory.get(cat.id) ?? [];
            return (
              <section
                key={cat.id}
                id={`category-${cat.slug}`}
                className="scroll-mt-24 rounded-2xl border border-[#dee2e6] bg-white/90 p-6 shadow-sm sm:p-8"
                aria-labelledby={`category-heading-${cat.slug}`}
              >
                <h3
                  id={`category-heading-${cat.slug}`}
                  className="mb-6 border-b border-[#dee2e6] pb-3 text-xl font-semibold text-[#0d6efd]"
                >
                  {cat.name}
                </h3>
                {list.length === 0 ? (
                  <EmptyCategoryRow categoryName={cat.name} />
                ) : (
                  <div
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    role="list"
                    aria-label={`Projects in ${cat.name}`}
                  >
                    {list.map((project) => (
                      <div key={project.id} role="listitem">
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EmptyCategoryRow({ categoryName }: { categoryName: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#ced4da] bg-white/80 px-6 py-12 text-center">
      <FolderOpen
        className="mb-3 size-10 text-[#adb5bd]"
        strokeWidth={1.25}
        aria-hidden
      />
      <p className="text-sm font-medium text-[#495057]">
        No published projects in {categoryName} yet.
      </p>
      <p className="mt-1 max-w-md text-xs text-[#6c757d]">
        New work will show up here once it is added from the admin dashboard.
      </p>
    </div>
  );
}
