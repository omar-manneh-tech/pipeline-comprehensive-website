/**
 * Home Page Management
 * Admin interface for managing home page sections with drag-and-drop reordering
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Eye,
  EyeOff,
  GripVertical,
  Upload,
  Loader2,
  Plus,
  Trash2,
  Edit,
  X,
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

interface PageContent {
  id: string;
  page: string;
  section: string;
  content: any; // JSON parsed content
  order: number;
  visible: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HomePageSection {
  id: string;
  key: string;
  label: string;
  description: string;
  defaultContent: any;
  icon?: React.ReactNode;
}

const HOME_SECTIONS: HomePageSection[] = [
  {
    id: "hero",
    key: "hero",
    label: "Hero Section",
    description: "Main hero banner with title, subtitle, and CTA buttons",
    defaultContent: {
      title: "Empowering Future Leaders",
      subtitle: "Where excellence meets innovation in education. Join us in shaping the leaders of tomorrow.",
      backgroundImage: "/images/hero/hero-main.png",
      ctaButtons: [
        { text: "Explore Programs", href: "/academics" },
        { text: "Apply Now", href: "/admissions" },
      ],
    },
  },
  {
    id: "about",
    key: "about",
    label: "About Section",
    description: "School overview and introduction",
    defaultContent: {
      title: "About Daddy Jobe Comprehensive School",
      description: "Daddy Jobe Comprehensive School is one of The Gambia's leading senior secondary institutions...",
      image: "/images/about/school_building.png",
      buttonText: "Learn More About Our Journey",
      buttonLink: "/about",
    },
  },
  {
    id: "core_values",
    key: "core_values",
    label: "Core Values Section",
    description: "School values and principles",
    defaultContent: {
      title: "Our Core Values",
      description: "At Daddy Jobe Comprehensive School, we believe education goes beyond books and classrooms.",
      values: [],
    },
  },
  {
    id: "student_life",
    key: "student_life",
    label: "Student Life Section",
    description: "Student activities and campus life",
    defaultContent: {
      title: "Life at Daddy Jobe",
      description: "Experience a vibrant campus community...",
      activities: [],
    },
  },
  {
    id: "library",
    key: "library",
    label: "Library Section",
    description: "Library and learning resources",
    defaultContent: {
      title: "Empowering Learning Through Knowledge",
      description: "Our state-of-the-art library serves as both a sanctuary for study and a hub for discovery.",
      image: "/images/library/library-main.jpg",
      buttonText: "Explore Library",
      buttonLink: "/library",
    },
  },
  {
    id: "statistics",
    key: "statistics",
    label: "Statistics Section",
    description: "Key numbers and achievements",
    defaultContent: {
      title: "At a Glance",
      description: "Discover what makes Daddy Jobe Comprehensive School a leader in education",
      stats: [],
    },
  },
  {
    id: "events",
    key: "events",
    label: "Events Carousel",
    description: "School events and achievements",
    defaultContent: {
      title: "School Events & Achievements",
      description: "Celebrating excellence and innovation",
      events: [],
    },
  },
  {
    id: "explore",
    key: "explore",
    label: "Explore Section",
    description: "Quick links to key pages",
    defaultContent: {
      title: "Explore Our School",
      description: "Discover more about what we offer",
      items: [],
    },
  },
  {
    id: "testimonials",
    key: "testimonials",
    label: "Testimonials Section",
    description: "Student, parent, and alumni testimonials",
    defaultContent: {
      title: "What People Say About Us",
      description: "Hear from students, parents, and educators about their experience at Daddy Jobe",
      testimonials: [],
    },
  },
];

function SortableSectionItem({
  section,
  content,
  onEdit,
  onToggleVisibility,
  onDelete,
}: {
  section: HomePageSection;
  content?: PageContent;
  onEdit: (section: HomePageSection) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isVisible = content?.visible !== false;
  const isPublished = content?.published !== false;

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={`mb-4 ${isDragging ? "shadow-lg" : ""} ${!isVisible ? "opacity-60" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>

            {/* Section Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-navy mb-1">
                    {section.label}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {section.description}
                  </p>
                  {content && (
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          isVisible
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleVisibility(content?.id || section.key, !isVisible)}
                    title={isVisible ? "Hide section" : "Show section"}
                  >
                    {isVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(section)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {content && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(content.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HomePageManagement() {
  const router = useRouter();
  const [sections, setSections] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<HomePageSection | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: PageContent[] }>(
        "/admin/pages/content?page=home"
      );

      if (response.success) {
        setSections(response.data);
      }
    } catch (error) {
      console.error("[Home Page Management Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find sections in current order
      const orderedSections = HOME_SECTIONS.map((s) => {
        const content = sections.find((c) => c.section === s.key);
        return {
          id: content?.id || s.key,
          section: s.key,
          order: HOME_SECTIONS.findIndex((sec) => sec.key === s.key),
        };
      });

      const activeIndex = orderedSections.findIndex((s) => s.id === active.id);
      const overIndex = orderedSections.findIndex((s) => s.id === over.id);

      const newOrder = arrayMove(orderedSections, activeIndex, overIndex);
      const updatedOrder = newOrder.map((item, index) => ({
        id: item.id,
        order: index * 10, // Use multiples of 10 for flexibility
      }));

      // Update order in state
      setSections((prev) => {
        const updated = [...prev];
        updatedOrder.forEach(({ id, order }) => {
          const index = updated.findIndex((s) => s.id === id || s.section === id);
          if (index !== -1) {
            updated[index] = { ...updated[index], order };
          }
        });
        return updated.sort((a, b) => a.order - b.order);
      });

      // Update order in database
      try {
        await apiClient.put("/admin/pages/content/reorder", {
          items: updatedOrder.filter((item) => sections.find((s) => s.id === item.id)),
        });
      } catch (error) {
        console.error("[Reorder Error]", error);
        // Revert on error
        fetchSections();
      }
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    try {
      const content = sections.find((s) => s.id === id);
      if (!content) {
        // Create new content if it doesn't exist
        const section = HOME_SECTIONS.find((s) => s.key === id);
        if (!section) return;

        await apiClient.post("/admin/pages/content", {
          page: "home",
          section: section.key,
          content: section.defaultContent,
          visible,
          published: false,
          order: sections.length * 10,
        });
      } else {
        await apiClient.put(`/admin/pages/content?id=${id}`, {
          visible,
        });
      }
      fetchSections();
    } catch (error) {
      console.error("[Toggle Visibility Error]", error);
      alert("Failed to update section visibility");
    }
  };

  const handleEdit = (section: HomePageSection) => {
    const content = sections.find((s) => s.section === section.key);
    setEditingSection(section);
    setFormData(content?.content || section.defaultContent);
  };

  const handleSave = async (publish: boolean = false) => {
    if (!editingSection) return;

    try {
      setSaving(true);
      const content = sections.find((s) => s.section === editingSection.key);

      if (content) {
        // Update existing
        await apiClient.put(`/admin/pages/content?id=${content.id}`, {
          content: formData,
          published: publish,
        });
      } else {
        // Create new
        await apiClient.post("/admin/pages/content", {
          page: "home",
          section: editingSection.key,
          content: formData,
          visible: true,
          published: publish,
          order: sections.length * 10,
        });
      }

      setEditingSection(null);
      setFormData(null);
      fetchSections();
    } catch (error) {
      console.error("[Save Error]", error);
      alert("Failed to save section content");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section content?")) return;

    try {
      await apiClient.delete(`/admin/pages/content/${id}`);
      fetchSections();
    } catch (error) {
      console.error("[Delete Error]", error);
      alert("Failed to delete section content");
    }
  };

  // Merge sections with content
  const mergedSections = HOME_SECTIONS.map((section) => {
    const content = sections.find((c) => c.section === section.key);
    return {
      section,
      content,
      order: content?.order ?? HOME_SECTIONS.findIndex((s) => s.key === section.key) * 10,
    };
  }).sort((a, b) => a.order - b.order);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Home Page Management</h1>
          <p className="text-gray-600">
            Manage home page sections, content, and visibility
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit {editingSection.label}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingSection(null);
                    setFormData(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Simple JSON editor for now - can be enhanced with specific fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (JSON)
                </label>
                <textarea
                  value={JSON.stringify(formData, null, 2)}
                  onChange={(e) => {
                    try {
                      setFormData(JSON.parse(e.target.value));
                    } catch {
                      // Invalid JSON, keep previous
                    }
                  }}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </>
                  )}
                </Button>
                <Button onClick={() => handleSave(true)} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Publish
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sections List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading sections...</p>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop sections to reorder. Changes are saved automatically.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={mergedSections.map((item) => item.section.key)}
              strategy={verticalListSortingStrategy}
            >
              {mergedSections.map(({ section, content }) => (
                <SortableSectionItem
                  key={section.key}
                  section={section}
                  content={content}
                  onEdit={handleEdit}
                  onToggleVisibility={handleToggleVisibility}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-navy">{mergedSections.length}</div>
            <div className="text-sm text-gray-600">Total Sections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {mergedSections.filter((s) => s.content?.visible !== false).length}
            </div>
            <div className="text-sm text-gray-600">Visible</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {mergedSections.filter((s) => s.content?.published !== false).length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

