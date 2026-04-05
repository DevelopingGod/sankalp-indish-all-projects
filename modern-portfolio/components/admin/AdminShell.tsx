"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/projects", label: "Projects", icon: Package },
];

type Props = {
  email: string;
  children: React.ReactNode;
};

export function AdminShell({ email, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#212529]">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="border-b border-[#dee2e6] bg-[#212529] text-white md:w-56 md:shrink-0 md:border-b-0 md:border-r">
          <div className="flex flex-col gap-1 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">
              Admin
            </p>
            <p className="mb-4 truncate text-sm text-white/85" title={email}>
              {email}
            </p>
            <nav className="flex flex-col gap-1">
              {links.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors ${
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-300 hover:bg-white/10 hover:text-red-200"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </button>
          </div>
        </aside>
        <div className="min-w-0 flex-1 p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
