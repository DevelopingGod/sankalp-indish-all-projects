import { ProfilePhoto } from "@/components/viewer/ProfilePhoto";
import { PublicPageLayout } from "@/components/viewer/PublicPageLayout";
import { Cookie, Smile } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Projects by SI",
  description: "About Sankalp Indish — Business Analyst, data, and software projects.",
};

export default function AboutPage() {
  return (
    <PublicPageLayout>
      <section className="bg-[#0d6efd] py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="text-3xl font-semibold sm:text-4xl">About Me</h1>
          <p className="mt-3 text-lg text-white/95 sm:text-xl">
            Get to know the person behind the code
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="flex flex-col items-stretch gap-10 md:flex-row md:items-center md:gap-12">
          <div className="flex shrink-0 justify-center md:w-2/5">
            <ProfilePhoto />
          </div>
          <div className="md:w-3/5">
            <h2 className="mb-4 text-2xl font-bold text-[#0d6efd]">
              Sankalp Indish
            </h2>
            <p className="text-lg leading-relaxed text-[#212529]">
              I am a passionate Business Analyst with expertise in Python, Power
              BI, Tableau, and SQL. I love solving complex problems and building
              dynamic data-driven solutions.
            </p>
            <p className="mt-4 leading-relaxed text-[#6c757d]">
              My portfolio features various projects across AI, Data, and
              Software Development. I constantly explore new technologies to
              deliver innovative solutions.
            </p>
            <p className="mt-4 leading-relaxed text-[#212529]">
              It is indeed a great pleasure for me that you decided to stop by
              and check out my projects. Have fun exploring and do connect for
              collaborative work!{" "}
              <Smile
                className="inline-block size-5 text-amber-500"
                aria-hidden
              />
            </p>
            <div
              className="mt-6 flex gap-2 rounded-md border-l-[5px] border-[#0d6efd] bg-[#e7f1ff] px-4 py-4 text-[#212529]"
              role="note"
            >
              <Cookie className="mt-0.5 size-5 shrink-0 text-[#0d6efd]" aria-hidden />
              <p>
                <strong>Note:</strong> Don&apos;t forget to carry some work-along
                snacks if you decide to meet for work!
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
