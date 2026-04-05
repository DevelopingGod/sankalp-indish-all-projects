import Link from "next/link";
import { FolderTree, Package } from "lucide-react";

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#212529]">Dashboard</h1>
      <p className="mt-2 max-w-xl text-[#6c757d]">
        Manage categories and projects. Changes appear on the public gallery
        after you save.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/categories"
          className="flex items-center gap-4 rounded-xl border border-[#dee2e6] bg-white p-6 no-underline shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="flex size-12 items-center justify-center rounded-lg bg-[#e7f1ff] text-[#0d6efd]">
            <FolderTree className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#212529]">
              Categories
            </h2>
            <p className="text-sm text-[#6c757d]">
              Create, edit, or remove portfolio categories.
            </p>
          </div>
        </Link>
        <Link
          href="/admin/projects"
          className="flex items-center gap-4 rounded-xl border border-[#dee2e6] bg-white p-6 no-underline shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="flex size-12 items-center justify-center rounded-lg bg-[#e7f1ff] text-[#0d6efd]">
            <Package className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#212529]">Projects</h2>
            <p className="text-sm text-[#6c757d]">
              CRUD projects, assign categories, upload images.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
