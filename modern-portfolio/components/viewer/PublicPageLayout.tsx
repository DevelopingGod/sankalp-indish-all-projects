import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type Props = {
  children: React.ReactNode;
  mainClassName?: string;
};

export function PublicPageLayout({ children, mainClassName }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-[#212529]">
      <SiteHeader />
      <main className={`flex-1 ${mainClassName ?? ""}`}>{children}</main>
      <SiteFooter />
    </div>
  );
}
