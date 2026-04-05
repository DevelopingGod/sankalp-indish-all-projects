import { PublicPageLayout } from "@/components/viewer/PublicPageLayout";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

const PROFILE_SITE_URL =
  "https://sites.google.com/view/sankalp-indish/" as const;

export const metadata: Metadata = {
  title: "Full Profile | Projects by SI",
  description:
    "Comprehensive professional background and portfolio on Google Sites.",
};

export default function MainProfilePage() {
  return (
    <PublicPageLayout>
      <section className="bg-[#0d6efd] py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-semibold sm:text-4xl">Full Profile</h1>
          <p className="mt-4 text-lg leading-relaxed text-white/95">
            This page points to my full professional profile: experience,
            education, skills, and selected work in one place—hosted on Google
            Sites for easy updates and a complete narrative beyond this project
            gallery.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="rounded-2xl border border-[#dee2e6] bg-white p-8 text-center shadow-sm sm:p-10">
          <p className="text-[#6c757d]">
            Open the full profile to explore my background in depth.
          </p>
          <a
            href={PROFILE_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-[#0d6efd] px-8 py-3.5 text-base font-semibold text-white no-underline shadow-sm transition-colors hover:bg-[#0b5ed7]"
          >
            View full profile on Google Sites
            <ExternalLink className="size-5 shrink-0 opacity-90" aria-hidden />
          </a>
        </div>
      </section>
    </PublicPageLayout>
  );
}
