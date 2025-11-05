/**
 * Blog Layout
 * Layout for blog pages with metadata
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Insights and Educational Resources",
  description: "Read insightful articles, student success stories, study tips, career guidance, and educational resources from Daddy Jobe Comprehensive School.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

