import { HeroSection } from "@/components/HeroSection";
import { CarouselSection } from "@/components/CarouselSection";
import { TileGrid } from "@/components/TileGrid";
import { ExploreSection } from "@/components/ExploreSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TileGrid />
      <CarouselSection />
      <ExploreSection />
      <TestimonialCarousel />
    </>
  );
}
