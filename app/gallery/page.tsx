/**
 * Gallery Page
 * Photo gallery showcasing school life, events, and activities
 */

import { HeroBanner } from "@/components/Gallery/HeroBanner";
import { GalleryOverview } from "@/components/Gallery/GalleryOverview";
import { PhotoGallery } from "@/components/Gallery/PhotoGallery";

export const metadata = {
  title: "Gallery",
  description: "Explore our photo gallery showcasing school life, events, achievements, and activities at Daddy Jobe Comprehensive School.",
};

// ISR: Revalidate every 30 minutes (gallery updates more frequently)
export const revalidate = 1800;

export default function GalleryPage() {
  return (
    <>
      <HeroBanner />
      <GalleryOverview />
      <PhotoGallery />
    </>
  );
}

