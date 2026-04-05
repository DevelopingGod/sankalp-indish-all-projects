import { ProjectManager } from "@/components/admin/ProjectManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Admin",
  robots: { index: false, follow: false },
};

export default function AdminProjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#212529]">Projects</h1>
      <p className="mt-2 text-[#6c757d]">
        Assign each project to a category (home page and{" "}
        <code className="rounded bg-[#e9ecef] px-1 text-sm">/category/[slug]</code>
        ). Add custom link buttons for the public{" "}
        <code className="rounded bg-[#e9ecef] px-1 text-sm">/project/[slug]</code>{" "}
        page. Hero images go to the{" "}
        <code className="rounded bg-[#e9ecef] px-1 text-sm">
          project-images
        </code>{" "}
        bucket.
      </p>
      <div className="mt-8">
        <ProjectManager />
      </div>
    </div>
  );
}
