/**
 * Library Page
 * Information about the school library and its resources
 */

import { LibraryOverview } from "@/components/Library/LibraryOverview";
import { DigitalLibrary } from "@/components/Library/DigitalLibrary";
import { ContactLibrary } from "@/components/Library/ContactLibrary";

export const metadata = {
  title: "Library",
  description: "Empowering Learning Through Knowledge - Discover our modern library with thousands of books, research journals, e-books, and multimedia materials.",
};

// ISR: Revalidate every hour
export const revalidate = 3600;

export default function LibraryPage() {
  return (
    <>
      <LibraryOverview />
      <DigitalLibrary />
      <ContactLibrary />
    </>
  );
}

