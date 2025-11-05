/**
 * Testimonials Admin UI
 * Admin interface for managing testimonials
 */

"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Star,
  Upload,
  Loader2,
  X,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/services/api/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  image?: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

function SortableTestimonialItem({
  testimonial,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
}: {
  testimonial: Testimonial;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onTogglePublished: (id: string, published: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={`mb-4 ${isDragging ? "shadow-lg" : ""} ${!testimonial.published ? "opacity-60" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold flex-shrink-0">
              {testimonial.image ? (
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-navy">{testimonial.name}</h3>
                    {testimonial.featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gold font-semibold mb-2">{testimonial.role}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{testimonial.text}</p>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        testimonial.published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {testimonial.published ? "Published" : "Draft"}
                    </span>
                    {testimonial.featured && (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleFeatured(testimonial.id, !testimonial.featured)}
                    title={testimonial.featured ? "Unfeature" : "Feature"}
                  >
                    <Star className={`h-4 w-4 ${testimonial.featured ? "text-yellow-500 fill-yellow-500" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTogglePublished(testimonial.id, !testimonial.published)}
                    title={testimonial.published ? "Unpublish" : "Publish"}
                  >
                    {testimonial.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(testimonial.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<string>("All");
  const [publishedFilter, setPublishedFilter] = useState<string>("All");
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    text: "",
    image: "",
    featured: false,
    published: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: Testimonial[] }>(
        "/admin/testimonials"
      );

      if (response.success) {
        setTestimonials(response.data);
      }
    } catch (error) {
      console.error("[Testimonials Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = testimonials.findIndex((t) => t.id === active.id);
      const overIndex = testimonials.findIndex((t) => t.id === over.id);

      const newOrder = arrayMove(testimonials, activeIndex, overIndex);
      const updatedOrder = newOrder.map((item, index) => ({
        id: item.id,
        order: index * 10,
      }));

      setTestimonials(newOrder);

      try {
        await apiClient.put("/admin/testimonials/reorder", { items: updatedOrder });
      } catch (error) {
        console.error("[Reorder Error]", error);
        fetchTestimonials();
      }
    }
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setFormData({
      name: "",
      role: "",
      text: "",
      image: "",
      featured: false,
      published: true,
    });
    setIsNew(true);
  };

  const handleEdit = async (id: string) => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Testimonial }>(
        `/admin/testimonials/${id}`
      );

      if (response.success) {
        setEditingTestimonial(response.data);
        setFormData({
          name: response.data.name,
          role: response.data.role,
          text: response.data.text,
          image: response.data.image || "",
          featured: response.data.featured,
          published: response.data.published,
        });
        setIsNew(false);
      }
    } catch (error) {
      console.error("[Fetch Error]", error);
      alert("Failed to fetch testimonial");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "testimonials");

      const response = await apiClient.post<{ success: boolean; data: { url: string } }>(
        "/admin/media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success) {
        setFormData((prev) => ({ ...prev, image: response.data.url }));
      }
    } catch (error) {
      console.error("[Upload Error]", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        await apiClient.post("/admin/testimonials", formData);
      } else if (editingTestimonial) {
        await apiClient.put(`/admin/testimonials/${editingTestimonial.id}`, formData);
      }
      await fetchTestimonials();
      setEditingTestimonial(null);
      setIsNew(false);
    } catch (error) {
      console.error("[Save Error]", error);
      alert("Failed to save testimonial");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await apiClient.delete(`/admin/testimonials/${id}`);
      await fetchTestimonials();
    } catch (error) {
      console.error("[Delete Error]", error);
      alert("Failed to delete testimonial");
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await apiClient.put(`/admin/testimonials/${id}`, { featured });
      await fetchTestimonials();
    } catch (error) {
      console.error("[Toggle Featured Error]", error);
      alert("Failed to update testimonial");
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      await apiClient.put(`/admin/testimonials/${id}`, { published });
      await fetchTestimonials();
    } catch (error) {
      console.error("[Toggle Published Error]", error);
      alert("Failed to update testimonial");
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !testimonial.name.toLowerCase().includes(searchLower) &&
        !testimonial.role.toLowerCase().includes(searchLower) &&
        !testimonial.text.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (featuredFilter !== "All" && testimonial.featured !== (featuredFilter === "true")) {
      return false;
    }
    if (publishedFilter !== "All" && testimonial.published !== (publishedFilter === "true")) {
      return false;
    }
    return true;
  });

  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.order - b.order;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Testimonials Management</h1>
          <p className="text-gray-600">Manage testimonials for the home page</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Edit Modal */}
      {(editingTestimonial || isNew) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isNew ? "Add Testimonial" : "Edit Testimonial"}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingTestimonial(null);
                    setIsNew(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Parent, Student, Alumni"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Testimonial Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Testimonial text..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                {formData.image && (
                  <div className="mb-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gold">
                      <Image
                        src={formData.image}
                        alt="Profile"
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <Button type="button" variant="outline" disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {formData.image ? "Change Image" : "Upload Image"}
                        </>
                      )}
                    </Button>
                  </label>
                  {formData.image && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, image: "" })}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setEditingTestimonial(null);
                  setIsNew(false);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search testimonials by name, role, or text..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">All Featured</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
              <select
                value={publishedFilter}
                onChange={(e) => setPublishedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">All Status</option>
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      ) : sortedTestimonials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No testimonials found</p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Testimonial
          </Button>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop items to reorder. Changes are saved automatically.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedTestimonials.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedTestimonials.map((testimonial) => (
                <SortableTestimonialItem
                  key={testimonial.id}
                  testimonial={testimonial}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFeatured={handleToggleFeatured}
                  onTogglePublished={handleTogglePublished}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-navy">{testimonials.length}</div>
            <div className="text-sm text-gray-600">Total Testimonials</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {testimonials.filter((t) => t.published).length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {testimonials.filter((t) => t.featured).length}
            </div>
            <div className="text-sm text-gray-600">Featured</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {testimonials.filter((t) => !t.published).length}
            </div>
            <div className="text-sm text-gray-600">Draft</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

