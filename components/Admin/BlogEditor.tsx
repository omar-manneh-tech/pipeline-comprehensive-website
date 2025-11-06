/**
 * Blog Editor Component
 * Shared component for creating and editing blog posts
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/Admin/RichTextEditor";
import { apiClient } from "@/services/api/client";
import { blogCategories } from "@/lib/data/blog";

interface BlogEditorProps {
  postId?: string;
}

export function BlogEditor({ postId }: BlogEditorProps) {
  const router = useRouter();
  const isNew = !postId || postId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "Educational Articles",
    tags: [] as string[],
    author: "",
    authorRole: "",
    publishedDate: new Date().toISOString().split("T")[0],
    readTime: 5,
    featured: false,
    published: false,
  });

  useEffect(() => {
    if (!isNew && postId) {
      fetchPost();
    }
  }, [postId, isNew]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(
        `/admin/blog/${postId}`
      );

      if (response.success) {
        const post = response.data;
        setFormData({
          slug: typeof post.slug === "string" ? post.slug : "",
          title: typeof post.title === "string" ? post.title : "",
          excerpt: typeof post.excerpt === "string" ? post.excerpt : "",
          content: post.content,
          image: post.image,
          category: post.category,
          tags: Array.isArray(post.tags) ? post.tags : [],
          author: post.author,
          authorRole: post.authorRole || "",
          publishedDate: new Date(post.publishedDate).toISOString().split("T")[0],
          readTime: post.readTime,
          featured: post.featured || false,
          published: post.published || false,
        });
      }
    } catch (error) {
      console.error("[Fetch Error]", error);
      alert("Failed to load blog post");
      router.push("/admin/blog");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
      } else {
        alert(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("[Upload Error]", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (publish: boolean = false) => {
    try {
      setSaving(true);
      setErrors({});

      // Validation
      if (!formData.title.trim()) {
        setErrors({ title: "Title is required" });
        return;
      }
      if (!formData.slug.trim()) {
        setErrors({ slug: "Slug is required" });
        return;
      }
      if (!formData.excerpt.trim()) {
        setErrors({ excerpt: "Excerpt is required" });
        return;
      }
      if (!formData.content.trim()) {
        setErrors({ content: "Content is required" });
        return;
      }
      if (!formData.image) {
        setErrors({ image: "Image is required" });
        return;
      }

      const payload = {
        ...formData,
        publishedDate: new Date(formData.publishedDate).toISOString(),
        published: publish,
      };

      let response: { success: boolean; message?: string; data?: Record<string, unknown> };
      if (isNew) {
        response = await apiClient.post<{ success: boolean; message?: string; data?: Record<string, unknown> }>("/admin/blog", payload);
      } else {
        response = await apiClient.put<{ success: boolean; message?: string; data?: Record<string, unknown> }>(`/admin/blog/${postId}`, payload);
      }

      if (response.success) {
        router.push("/admin/blog");
      } else {
        alert(response.message || "Failed to save blog post");
      }
    } catch (error: unknown) {
      console.error("[Save Error]", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error as { response?: { data?: { details?: Array<{ path: string[]; message: string }> } }; message?: string };
        if (errorResponse.response?.data?.details) {
          const details = errorResponse.response.data.details;
          const newErrors: Record<string, string> = {};
          details.forEach((detail: { path: string[]; message: string }) => {
            newErrors[detail.path[0]] = detail.message;
          });
          setErrors(newErrors);
        } else {
          alert(errorResponse.message || "Failed to save blog post");
        }
      } else {
        alert("Failed to save blog post");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? "Create New Blog Post" : "Edit Blog Post"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isNew ? "Write and publish a new article" : "Update your blog post"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/blog")}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={saving}
          >
            <Eye className="h-4 w-4 mr-2" />
            {saving ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter blog post title"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="blog-post-slug"
                  className={errors.slug ? "border-red-500" : ""}
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  URL-friendly version of the title (e.g., &quot;my-blog-post&quot;)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  placeholder="Brief description of the blog post"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.excerpt ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={errors.content ? "border border-red-500 rounded-lg p-1" : ""}>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, content: value }))
                  }
                />
              </div>
              {errors.content && (
                <p className="mt-2 text-sm text-red-600">{errors.content}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.image && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={formData.image}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                {uploading && (
                  <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                )}
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {blogCategories
                    .filter((cat) => cat !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <Input
                  value={formData.tags.join(", ")}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="education, learning, tips"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <Input
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Role
                </label>
                <Input
                  value={formData.authorRole}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, authorRole: e.target.value }))
                  }
                  placeholder="e.g., Academic Director"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Published Date
                </label>
                <Input
                  type="date"
                  value={formData.publishedDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, publishedDate: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Read Time (minutes)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      readTime: parseInt(e.target.value) || 5,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Post
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

