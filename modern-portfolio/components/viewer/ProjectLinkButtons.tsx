import type { ProjectCustomLink } from "@/lib/portfolio/custom-links";
import Link from "next/link";

function isProbablyExternal(url: string) {
  return /^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url);
}

type Props = {
  links: ProjectCustomLink[];
};

export function ProjectLinkButtons({ links }: Props) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link, i) => {
        const url = link.url.trim();
        const external = isProbablyExternal(url);
        const internalApp = url.startsWith("/") && !external;

        const className =
          "inline-flex items-center justify-center rounded-md bg-[#0d6efd] px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-[#0b5ed7]";

        if (internalApp) {
          return (
            <Link key={`${url}-${i}`} href={url} className={className}>
              {link.label}
            </Link>
          );
        }

        const href = external ? url : url.startsWith("/") ? url : `https://${url}`;

        return (
          <a
            key={`${href}-${i}`}
            href={href}
            className={className}
            {...(external || !url.startsWith("/")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
