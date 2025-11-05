/**
 * Academics Pages Management
 * Admin interface for managing academics page sections
 */

"use client";

import { useState, useEffect } from "react";
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
  content: any;
  order: number;
  visible: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AcademicsPageSection {
  id: string;
  key: string;
  label: string;
  description: string;
  defaultContent: any;
}

const ACADEMICS_SECTIONS: AcademicsPageSection[] = [
  {
    id: "hero_banner",
    key: "hero_banner",
    label: "Hero Banner",
    description: "Main hero banner with title, description, and image",
    defaultContent: {
      title: "Academic Excellence",
      description: "Comprehensive Senior Secondary Education",
      image: "/images/academics/hero-banner.jpg",
    },
  },
  {
    id: "overview",
    key: "overview",
    label: "Overview",
    description: "Academic overview and statistics",
    defaultContent: {
      title: "Our Academic Programs",
      description: "We offer three comprehensive programs...",
      stats: [],
    },
  },
  {
    id: "programs",
    key: "programs",
    label: "Programs",
    description: "Science, Commerce, and Arts programs",
    defaultContent: {
      title: "Academic Programs",
      programs: [
        { name: "Science", description: "...", subjects: [] },
        { name: "Commerce", description: "...", subjects: [] },
        { name: "Arts", description: "...", subjects: [] },
      ],
    },
  },
  {
    id: "facilities",
    key: "facilities",
    label: "Facilities",
    description: "Academic facilities and resources",
    defaultContent: {
      title: "Our Facilities",
      facilities: [],
    },
  },
  {
    id: "core_subjects",
    key: "core_subjects",
    label: "Core Subjects",
    description: "Core subjects across all programs",
    defaultContent: {
      title: "Core Subjects",
      subjects: [],
    },
  },
  {
    id: "elective_subjects",
    key: "elective_subjects",
    label: "Elective Subjects",
    description: "Program-specific elective subjects",
    defaultContent: {
      title: "Elective Subjects",
      subjects: [],
    },
  },
  {
    id: "career_paths",
    key: "career_paths",
    label: "Career Paths",
    description: "Career opportunities after graduation",
    defaultContent: {
      title: "Career Paths",
      paths: [],
    },
  },
  {
    id: "program_requirements",
    key: "program_requirements",
    label: "Program Requirements",
    description: "Requirements for each program",
    defaultContent: {
      title: "Program Requirements",
      requirements: [],
    },
  },
  {
    id: "wassce_preparation",
    key: "wassce_preparation",
    label: "WASSCE Preparation",
    description: "WASSCE exam preparation and support",
    defaultContent: {
      title: "WASSCE Preparation",
      steps: [],
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
  section: AcademicsPageSection;
  content: PageContent | null;
  onEdit: (section: AcademicsPageSection, content: PageContent | null) => void;
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

  const isVisible = content?.visible ?? true;
  const hasContent = content !== null;

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={`mb-4 ${isDragging ? "shadow-lg" : ""} ${!isVisible ? "opacity-60" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-navy">{section.label}</h3>
                    {!hasContent && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Not Created
                      </span>
                    )}
                    {!isVisible && (
                      <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                  {hasContent && (
                    <p className="text-xs text-gray-500">
                      Last updated: {new Date(content.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {hasContent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleVisibility(content.id, !isVisible)}
                      title={isVisible ? "Hide section" : "Show section"}
                    >
                      {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => onEdit(section, content)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {hasContent && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(content.id)}
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

export default function AcademicsPageManagement() {
  const [sections, setSections] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<{
    section: AcademicsPageSection;
    content: PageContent | null;
  } | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);

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
        "/admin/pages/content?page=academics"
      );

      if (response.success) {
        setSections(response.data);
      }
    } catch (error) {
      console.error("[Academics Page Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = ACADEMICS_SECTIONS.findIndex((s) => s.key === active.id);
      const overIndex = ACADEMICS_SECTIONS.findIndex((s) => s.key === over.id);

      const newOrder = arrayMove(ACADEMICS_SECTIONS, activeIndex, overIndex);
      const updatedOrder = newOrder.map((section, index) => {
        const existingContent = sections.find((s) => s.section === section.key);
        return {
          id: existingContent?.id || section.key,
          order: index * 10,
        };
      }).filter((item) => sections.find((s) => s.id === item.id));

      if (updatedOrder.length > 0) {
        try {
          await apiClient.put("/admin/pages/content/reorder", {
            items: updatedOrder,
          });
          await fetchSections();
        } catch (error) {
          console.error("[Reorder Error]", error);
        }
      }
    }
  };

  const handleEdit = (section: AcademicsPageSection, content: PageContent | null) => {
    setEditingSection({ section, content });
    if (content) {
      setFormData(content.content);
    } else {
      setFormData({ ...section.defaultContent });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "pages");

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
        setFormData((prev: any) => ({ ...prev, [field]: response.data.url }));
      }
    } catch (error) {
      console.error("[Upload Error]", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editingSection) return;

    try {
      const payload = {
        page: "academics",
        section: editingSection.section.key,
        content: formData,
        visible: editingSection.content?.visible ?? true,
        order: editingSection.content?.order ?? ACADEMICS_SECTIONS.findIndex((s) => s.key === editingSection.section.key) * 10,
      };

      if (editingSection.content) {
        await apiClient.put(`/admin/pages/content?id=${editingSection.content.id}`, payload);
      } else {
        await apiClient.post("/admin/pages/content", payload);
      }

      await fetchSections();
      setEditingSection(null);
      setFormData({});
    } catch (error) {
      console.error("[Save Error]", error);
      alert("Failed to save section");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      await apiClient.delete(`/admin/pages/content/${id}`);
      await fetchSections();
    } catch (error) {
      console.error("[Delete Error]", error);
      alert("Failed to delete section");
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    try {
      const content = sections.find((s) => s.id === id);
      if (content) {
        await apiClient.put(`/admin/pages/content?id=${id}`, {
          ...content,
          visible,
        });
        await fetchSections();
      }
    } catch (error) {
      console.error("[Toggle Visibility Error]", error);
      alert("Failed to update visibility");
    }
  };

  const getSectionContent = (sectionKey: string): PageContent | null => {
    return sections.find((s) => s.section === sectionKey) || null;
  };

  const sortedSections = [...ACADEMICS_SECTIONS].sort((a, b) => {
    const aContent = getSectionContent(a.key);
    const bContent = getSectionContent(b.key);
    return (aContent?.order ?? 0) - (bContent?.order ?? 0);
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Academics Pages Management</h1>
          <p className="text-gray-600">Manage academics page sections and content</p>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingSection.content ? "Edit" : "Create"} {editingSection.section.label}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingSection(null);
                    setFormData({});
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hero Banner */}
              {editingSection.section.key === "hero_banner" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Hero title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Hero description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    {formData.image && (
                      <div className="mb-4">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={formData.image}
                            alt="Hero banner"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "image")}
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
                </>
              )}

              {/* Other Sections - JSON Editor */}
              {editingSection.section.key !== "hero_banner" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Section title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (JSON)</label>
                    <textarea
                      value={JSON.stringify(formData, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setFormData(parsed);
                        } catch {
                          // Invalid JSON, keep as is
                        }
                      }}
                      placeholder='{"description": "", "programs": [], ...}'
                      rows={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Edit JSON content for {editingSection.section.label} section
                    </p>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setEditingSection(null);
                  setFormData({});
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

      {/* Sections List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading sections...</p>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop sections to reorder. Click Edit to create or modify section content.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSections.map((s) => s.key)}
              strategy={verticalListSortingStrategy}
            >
              {sortedSections.map((section) => (
                <SortableSectionItem
                  key={section.key}
                  section={section}
                  content={getSectionContent(section.key)}
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
            <div className="text-2xl font-bold text-navy">{ACADEMICS_SECTIONS.length}</div>
            <div className="text-sm text-gray-600">Total Sections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {sections.filter((s) => s.visible).length}
            </div>
            <div className="text-sm text-gray-600">Visible Sections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{sections.length}</div>
            <div className="text-sm text-gray-600">Created Sections</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

