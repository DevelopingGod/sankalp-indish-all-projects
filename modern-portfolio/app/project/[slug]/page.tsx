import { ProjectLinkButtons } from "@/components/viewer/ProjectLinkButtons";
import { PublicPageLayout } from "@/components/viewer/PublicPageLayout";
import { parseCustomLinks } from "@/lib/portfolio/custom-links";
import {
  fetchPublishedProjectBySlug,
  fetchPublishedProjectWithCategory,
} from "@/lib/portfolio/fetch-public";
import { isSupabasePublicObjectUrl } from "@/lib/portfolio/image-url";
import { ImageOff } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await fetchPublishedProjectBySlug(slug);
  if (!project) {
    return { title: "Project | Projects by SI" };
  }
  return {
    title: `${project.title} | Projects by SI`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const { project, category, error } =
    await fetchPublishedProjectWithCategory(slug);

  if (!project) {
    notFound();
  }

  const backHref = category
    ? `/category/${encodeURIComponent(category.slug)}`
    : "/";
  const backLabel = category
    ? `← Back to ${category.name}`
    : "← Back home";

  const customLinks = parseCustomLinks(project.custom_links);
  const useNextImage =
    project.image_url && isSupabasePublicObjectUrl(project.image_url);

  return (
    <PublicPageLayout>
      {error ? (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        </div>
      ) : null}

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm text-[#6c757d]">
          <Link
            href={backHref}
            className="font-medium text-[#0d6efd] no-underline hover:underline"
          >
            {backLabel}
          </Link>
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#212529] sm:text-4xl">
          {project.title}
        </h1>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#dee2e6] bg-[#e9ecef] shadow-sm">
          {!project.image_url ? (
            <div className="flex size-full items-center justify-center text-[#6c757d]">
              <ImageOff className="size-16 opacity-50" aria-hidden />
            </div>
          ) : useNextImage ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image_url}
              alt={project.title}
              className="size-full object-cover"
            />
          )}
        </div>

        {project.description?.trim() ? (
          <div className="prose prose-neutral mt-10 max-w-none text-[#212529]">
            <p className="whitespace-pre-wrap text-base leading-relaxed">
              {project.description}
            </p>
          </div>
        ) : (
          <p className="mt-10 text-base leading-relaxed text-[#6c757d]">
            {project.summary}
          </p>
        )}

        <div className="mt-10 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6c757d]">
            Links
          </h2>
          {customLinks.length > 0 ? (
            <ProjectLinkButtons links={customLinks} />
          ) : (
            <p className="text-sm text-[#6c757d]">No links added for this project.</p>
          )}
          {project.repo_url?.trim() ? (
            <div className="pt-2">
              <a
                href={project.repo_url.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-[#dee2e6] bg-white px-4 py-2.5 text-sm font-semibold text-[#212529] no-underline hover:bg-[#f8f9fa]"
              >
                Repository
              </a>
            </div>
          ) : null}
        </div>
      </article>
    </PublicPageLayout>
  );
}
