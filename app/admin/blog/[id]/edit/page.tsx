/**
 * Blog Editor Page
 * Edit existing blog post
 */

import { use } from "react";
import { BlogEditor } from "@/components/Admin/BlogEditor";

export default function BlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <BlogEditor postId={id} />;
}
