import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { CoreValuesSection } from "@/components/CoreValuesSection";
import { StudentLifeSection } from "@/components/StudentLifeSection";
import { LibraryHomeSection } from "@/components/LibraryHomeSection";
import dynamic from "next/dynamic";
import { TileGrid } from "@/components/TileGrid";
import { ExploreSection } from "@/components/ExploreSection";

/**
 * Lazy loaded components for better performance
 * These components use animations and are not critical for initial render
 * Lazy loading reduces initial bundle size and improves TTI
 */
const CarouselSection = dynamic(() => import("@/components/CarouselSection").then((mod) => ({ default: mod.CarouselSection })), {
  loading: () => <CarouselSectionSkeleton />,
});

const TestimonialCarousel = dynamic(() => import("@/components/TestimonialCarousel").then((mod) => ({ default: mod.TestimonialCarousel })), {
  loading: () => <TestimonialSkeleton />,
});

/**
 * Home Page
 * Uses ISR (Incremental Static Regeneration) for better performance
 * Revalidates every 3600 seconds (1 hour)
 */
export const revalidate = 3600; // Revalidate every hour

/**
 * Loading Skeletons for lazy-loaded components
 */
function CarouselSectionSkeleton() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-gray-300 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="h-[500px] bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function TestimonialSkeleton() {
  return (
    <section className="py-20 bg-white mb-0">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <div className="h-10 w-80 bg-gray-300 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CoreValuesSection />
      <StudentLifeSection />
      <LibraryHomeSection />
      <TileGrid />
      <CarouselSection />
      <ExploreSection />
      <TestimonialCarousel />
    </>
  );
}
