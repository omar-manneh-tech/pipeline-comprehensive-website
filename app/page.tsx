import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { CoreValuesSection } from "@/components/CoreValuesSection";
import { StudentLifeSection } from "@/components/StudentLifeSection";
import { CarouselSection } from "@/components/CarouselSection";
import { TileGrid } from "@/components/TileGrid";
import { ExploreSection } from "@/components/ExploreSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CoreValuesSection />
      <StudentLifeSection />
      <TileGrid />
      <CarouselSection />
      <ExploreSection />
      <TestimonialCarousel />
    </>
  );
}
