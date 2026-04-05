import { GallerySkeleton } from "@/components/viewer/GallerySkeleton";
import { HeroSection } from "@/components/viewer/HeroSection";
import { SiteFooter } from "@/components/viewer/SiteFooter";
import { SiteHeader } from "@/components/viewer/SiteHeader";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#212529]">
      <SiteHeader />
      <HeroSection />
      <main className="flex-1 bg-white">
        <GallerySkeleton />
      </main>
      <SiteFooter />
    </div>
  );
}
