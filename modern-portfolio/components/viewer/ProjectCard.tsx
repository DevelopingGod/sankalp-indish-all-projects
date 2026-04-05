import { isSupabasePublicObjectUrl } from "@/lib/portfolio/image-url";
import type { Project } from "@/lib/types/portfolio";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  const useNextImage =
    project.image_url && isSupabasePublicObjectUrl(project.image_url);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-black/[0.06] bg-white shadow-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-md">
      <div className="relative aspect-[16/10] w-full bg-[#e9ecef]">
        {!project.image_url ? (
          <div className="flex size-full items-center justify-center text-[#6c757d]">
            <ImageOff className="size-12 opacity-60" aria-hidden />
            <span className="sr-only">No image</span>
          </div>
        ) : useNextImage ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-[#212529]">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6c757d]">
          {project.summary}
        </p>
        <div className="mt-4">
          <Link
            href={`/project/${encodeURIComponent(project.slug)}`}
            className="inline-flex w-full items-center justify-center rounded-md bg-[#0d6efd] px-4 py-2 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-[#0b5ed7] sm:w-auto"
          >
            View Project
          </Link>
        </div>
      </div>
    </article>
  );
}
