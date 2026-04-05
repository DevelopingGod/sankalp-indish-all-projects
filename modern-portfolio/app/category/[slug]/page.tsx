import { ProjectCard } from "@/components/viewer/ProjectCard";
import { PublicPageLayout } from "@/components/viewer/PublicPageLayout";
import { fetchCategoryPageData } from "@/lib/portfolio/fetch-public";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await fetchCategoryPageData(slug);
  if (!category) {
    return { title: "Category | Projects by SI" };
  }
  return {
    title: `${category.name} | Projects by SI`,
    description: `Projects in ${category.name} by Sankalp Indish.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const { category, projects, error } = await fetchCategoryPageData(slug);

  if (!category) {
    notFound();
  }

  return (
    <PublicPageLayout>
      <section className="bg-[#0d6efd] py-12 text-center text-white sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-medium text-white/85">
            <Link
              href="/#categories"
              className="text-white/90 underline-offset-2 hover:text-white hover:underline"
            >
              ← All categories
            </Link>
          </p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 text-lg text-white/95">
            {projects.length}{" "}
            {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        {error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : projects.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#ced4da] bg-white px-6 py-12 text-center text-[#6c757d]">
            No published projects in this category yet.
          </p>
        ) : (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {projects.map((project) => (
              <div key={project.id} role="listitem">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </section>
    </PublicPageLayout>
  );
}
