import { GallerySkeleton } from "@/components/viewer/GallerySkeleton";
import { HeroSection } from "@/components/viewer/HeroSection";
import { SiteFooter } from "@/components/viewer/SiteFooter";
import { SiteHeader } from "@/components/viewer/SiteHeader";
import { ViewerGallery } from "@/components/viewer/ViewerGallery";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#212529]">
      <SiteHeader />
      <HeroSection />
      <main className="flex-1 bg-white">
        <Suspense fallback={<GallerySkeleton />}>
          <ViewerGallery />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
