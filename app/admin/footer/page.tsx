/**
 * Footer Management UI
 * Admin interface for managing footer sections and links
 */

"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Link as LinkIcon,
  Folder,
  X,
  Save,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/services/api/client";

interface FooterSection {
  id: string;
  type: string;
  title: string;
  order: number;
  visible: boolean;
  links: FooterLink[];
  createdAt: string;
  updatedAt: string;
}

interface FooterLink {
  id: string;
  sectionId: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FooterManagementPage() {
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<FooterSection | null>(null);
  const [editingLink, setEditingLink] = useState<{ sectionId: string; link?: FooterLink } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [sectionForm, setSectionForm] = useState({
    type: "quick_links",
    title: "",
    visible: true,
  });
  const [linkForm, setLinkForm] = useState({
    label: "",
    href: "",
    visible: true,
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: FooterSection[] }>(
        "/admin/footer/sections"
      );

      if (response.success) {
        setSections(response.data);
        // Expand all sections by default
        setExpandedSections(new Set(response.data.map((s) => s.id)));
      }
    } catch (error) {
      console.error("[Footer Management Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = () => {
    setEditingSection(null);
    setSectionForm({
      type: "quick_links",
      title: "",
      visible: true,
    });
  };

  const handleEditSection = (section: FooterSection) => {
    setEditingSection(section);
    setSectionForm({
      type: section.type,
      title: section.title,
      visible: section.visible,
    });
  };

  const handleSaveSection = async () => {
    try {
      if (editingSection) {
        await apiClient.put(`/admin/footer/sections?id=${editingSection.id}`, sectionForm);
      } else {
        await apiClient.post("/admin/footer/sections", sectionForm);
      }
      await fetchSections();
      setEditingSection(null);
    } catch (error) {
      console.error("[Save Section Error]", error);
      alert("Failed to save footer section");
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this footer section? All links will be deleted.")) return;

    try {
      await apiClient.delete(`/admin/footer/sections/${id}`);
      await fetchSections();
    } catch (error) {
      console.error("[Delete Section Error]", error);
      alert("Failed to delete footer section");
    }
  };

  const handleAddLink = (sectionId: string) => {
    setEditingLink({ sectionId });
    setLinkForm({
      label: "",
      href: "",
      visible: true,
    });
  };

  const handleEditLink = (link: FooterLink) => {
    setEditingLink({ sectionId: link.sectionId, link });
    setLinkForm({
      label: link.label,
      href: link.href,
      visible: link.visible,
    });
  };

  const handleSaveLink = async () => {
    if (!editingLink) return;

    try {
      if (editingLink.link) {
        await apiClient.put(`/admin/footer/links?id=${editingLink.link.id}`, {
          ...linkForm,
          sectionId: editingLink.sectionId,
        });
      } else {
        await apiClient.post("/admin/footer/links", {
          ...linkForm,
          sectionId: editingLink.sectionId,
        });
      }
      await fetchSections();
      setEditingLink(null);
    } catch (error) {
      console.error("[Save Link Error]", error);
      alert("Failed to save footer link");
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this footer link?")) return;

    try {
      await apiClient.delete(`/admin/footer/links/${id}`);
      await fetchSections();
    } catch (error) {
      console.error("[Delete Link Error]", error);
      alert("Failed to delete footer link");
    }
  };

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Footer Management</h1>
          <p className="text-gray-600">Manage footer sections and links</p>
        </div>
        <Button onClick={handleAddSection}>
          <Plus className="h-4 w-4 mr-2" />
          Add Footer Section
        </Button>
      </div>

      {/* Section Edit Modal */}
      {editingSection !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingSection ? "Edit Footer Section" : "Add Footer Section"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSection(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={sectionForm.type}
                  onChange={(e) => setSectionForm({ ...sectionForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="quick_links">Quick Links</option>
                  <option value="programs">Programs</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                  placeholder="Section title"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sectionVisible"
                  checked={sectionForm.visible}
                  onChange={(e) => setSectionForm({ ...sectionForm, visible: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="sectionVisible" className="text-sm font-medium text-gray-700">
                  Visible
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditingSection(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSection}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Link Edit Modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingLink.link ? "Edit Footer Link" : "Add Footer Link"}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingLink(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label <span className="text-red-500">*</span>
                </label>
                <Input
                  value={linkForm.label}
                  onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                  placeholder="Link label"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL <span className="text-red-500">*</span>
                </label>
                <Input
                  value={linkForm.href}
                  onChange={(e) => setLinkForm({ ...linkForm, href: e.target.value })}
                  placeholder="/about"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="linkVisible"
                  checked={linkForm.visible}
                  onChange={(e) => setLinkForm({ ...linkForm, visible: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="linkVisible" className="text-sm font-medium text-gray-700">
                  Visible
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditingLink(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveLink}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer Sections */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading footer sections...</p>
        </div>
      ) : sortedSections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No footer sections found</p>
          <Button onClick={handleAddSection}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Footer Section
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const sortedLinks = [...section.links].sort((a, b) => a.order - b.order);

            return (
              <Card key={section.id} className={`${!section.visible ? "opacity-60" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(section.id)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-navy">{section.title}</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {section.type}
                          </span>
                          {!section.visible && (
                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {sortedLinks.length} link{sortedLinks.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditSection(section)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Links</h4>
                      <Button size="sm" onClick={() => handleAddLink(section.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Link
                      </Button>
                    </div>
                    {sortedLinks.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No links in this section
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {sortedLinks.map((link) => (
                          <Card key={link.id} className={`${!link.visible ? "opacity-60" : ""}`}>
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <LinkIcon className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-900">{link.label}</span>
                                    {!link.visible && (
                                      <span className="text-xs text-red-600">(Hidden)</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 truncate">{link.href}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditLink(link)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteLink(link.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-navy">{sections.length}</div>
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
            <div className="text-2xl font-bold text-blue-600">
              {sections.reduce((sum, s) => sum + s.links.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Links</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

