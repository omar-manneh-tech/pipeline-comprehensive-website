/**
 * Library Page
 * Information about the school library and its resources
 */

import { HeroBanner } from "@/components/Library/HeroBanner";
import { LibraryOverview } from "@/components/Library/LibraryOverview";
import { DigitalLibrary } from "@/components/Library/DigitalLibrary";
import { LibraryResources } from "@/components/Library/LibraryResources";
import { ContactLibrary } from "@/components/Library/ContactLibrary";

export const metadata = {
  title: "Library",
  description: "Empowering Learning Through Knowledge - Discover our modern library with thousands of books, research journals, e-books, and multimedia materials.",
};

export default function LibraryPage() {
  return (
    <>
      <HeroBanner />
      <LibraryOverview />
      <DigitalLibrary />
      <LibraryResources />
      <ContactLibrary />
    </>
  );
}

