import { LoginForm } from "@/components/admin/LoginForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin sign in | Projects by SI",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#dee2e6] bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-semibold text-[#212529]">
          Admin sign in
        </h1>
        <p className="mt-2 text-center text-sm text-[#6c757d]">
          Use your Supabase email and password account.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
        <p className="mt-8 text-center text-sm">
          <Link
            href="/"
            className="font-medium text-[#0d6efd] no-underline hover:underline"
          >
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
