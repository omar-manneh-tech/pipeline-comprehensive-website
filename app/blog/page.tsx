/**
 * Blog Page
 * Main blog page with search, categories, and pagination
 */

"use client";

import { HeroBanner } from "@/components/Blog/HeroBanner";
import { BlogExplorerSection } from "@/components/Blog/BlogExplorerSection";

export default function BlogPage() {
  return (
    <>
      <HeroBanner />
      <BlogExplorerSection />
    </>
  );
}

