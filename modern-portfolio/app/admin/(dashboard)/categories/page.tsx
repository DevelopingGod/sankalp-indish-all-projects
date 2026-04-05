import { CategoryManager } from "@/components/admin/CategoryManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Admin",
  robots: { index: false, follow: false },
};

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#212529]">Categories</h1>
      <p className="mt-2 text-[#6c757d]">
        Slugs are used in URLs and anchors on the public site (e.g.{" "}
        <code className="rounded bg-[#e9ecef] px-1 text-sm">#category-ai</code>
        ).
      </p>
      <div className="mt-8">
        <CategoryManager />
      </div>
    </div>
  );
}
