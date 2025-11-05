/**
 * SEO Management Admin UI
 * Admin interface for managing SEO metadata per page
 */

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Save,
  Loader2,
  Eye,
  Search as SearchIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  X,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/services/api/client";

interface PageSEO {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  updatedAt: string;
}

const COMMON_PAGES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/academics", label: "Academics" },
  { path: "/admissions", label: "Admissions" },
  { path: "/contact", label: "Contact" },
  { path: "/blog", label: "Blog" },
  { path: "/library", label: "Library" },
  { path: "/gallery", label: "Gallery" },
  { path: "/news", label: "News & Events" },
  { path: "/staff", label: "Staff" },
  { path: "/campus-life", label: "Campus Life" },
  { path: "/portal", label: "Portal" },
];

export default function SEOManagementPage() {
  const [seoSettings, setSeoSettings] = useState<Record<string, PageSEO>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [editingPage, setEditingPage] = useState<string>("");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
    ogType: "website",
    twitterCard: "summary",
    canonicalUrl: "",
  });

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  const fetchSEOSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: PageSEO[] }>(
        "/admin/seo"
      );

      if (response.success) {
        const settingsMap: Record<string, PageSEO> = {};
        response.data.forEach((setting) => {
          settingsMap[setting.page] = setting;
        });
        setSeoSettings(settingsMap);
      }
    } catch (error) {
      console.error("[SEO Management Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = async (pagePath: string) => {
    setSelectedPage(pagePath);
    setEditingPage(pagePath);

    const existing = seoSettings[pagePath];
    if (existing) {
      setFormData({
        title: existing.title,
        description: existing.description,
        keywords: existing.keywords || "",
        ogImage: existing.ogImage || "",
        ogType: existing.ogType || "website",
        twitterCard: existing.twitterCard || "summary",
        canonicalUrl: existing.canonicalUrl || "",
      });
    } else {
      // Load default or create new
      try {
        const response = await apiClient.get<{ success: boolean; data: PageSEO }>(
          `/admin/seo/${encodeURIComponent(pagePath)}`
        );

        if (response.success) {
          const setting = response.data;
          setFormData({
            title: setting.title,
            description: setting.description,
            keywords: setting.keywords || "",
            ogImage: setting.ogImage || "",
            ogType: setting.ogType || "website",
            twitterCard: setting.twitterCard || "summary",
            canonicalUrl: setting.canonicalUrl || "",
          });
        } else {
          // New page, set defaults
          setFormData({
            title: COMMON_PAGES.find((p) => p.path === pagePath)?.label || pagePath,
            description: "",
            keywords: "",
            ogImage: "",
            ogType: "website",
            twitterCard: "summary",
            canonicalUrl: pagePath,
          });
        }
      } catch {
        // New page, set defaults
        setFormData({
          title: COMMON_PAGES.find((p) => p.path === pagePath)?.label || pagePath,
          description: "",
          keywords: "",
          ogImage: "",
          ogType: "website",
          twitterCard: "summary",
          canonicalUrl: pagePath,
        });
      }
    }
  };

  const handleSave = async () => {
    if (!editingPage) return;

    try {
      setSaving(true);
      await apiClient.put(`/admin/seo/${encodeURIComponent(editingPage)}`, {
        ...formData,
        page: editingPage,
      });
      await fetchSEOSettings();
      alert("SEO settings saved successfully!");
    } catch (error) {
      console.error("[Save Error]", error);
      alert("Failed to save SEO settings");
    } finally {
      setSaving(false);
    }
  };

  const filteredPages = COMMON_PAGES.filter((page) => {
    if (search) {
      return (
        page.label.toLowerCase().includes(search.toLowerCase()) ||
        page.path.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">SEO Management</h1>
          <p className="text-gray-600">Manage SEO metadata for each page</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page List */}
        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search pages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredPages.map((page) => {
                const hasSEO = seoSettings[page.path];
                return (
                  <button
                    key={page.path}
                    onClick={() => handlePageSelect(page.path)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedPage === page.path
                        ? "bg-primary text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{page.label}</div>
                        <div className={`text-xs ${selectedPage === page.path ? "text-white/80" : "text-gray-500"}`}>
                          {page.path}
                        </div>
                      </div>
                      {hasSEO && (
                        <div className={`px-2 py-1 rounded text-xs ${
                          selectedPage === page.path
                            ? "bg-white/20 text-white"
                            : "bg-green-100 text-green-800"
                        }`}>
                          SEO
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* SEO Form */}
        <div className="lg:col-span-2">
          {editingPage ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>SEO Settings for {COMMON_PAGES.find((p) => p.path === editingPage)?.label || editingPage}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{editingPage}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingPage("");
                      setSelectedPage("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Page title for SEO"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.title.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Meta description for search engines"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords
                  </label>
                  <Input
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="comma, separated, keywords"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Open Graph Image URL
                  </label>
                  <Input
                    value={formData.ogImage}
                    onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                    placeholder="/images/og-image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL to image for social media sharing (recommended: 1200x630px)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OG Type
                    </label>
                    <select
                      value={formData.ogType}
                      onChange={(e) => setFormData({ ...formData, ogType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter Card
                    </label>
                    <select
                      value={formData.twitterCard}
                      onChange={(e) => setFormData({ ...formData, twitterCard: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Canonical URL
                  </label>
                  <Input
                    value={formData.canonicalUrl}
                    onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                    placeholder={editingPage}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Preferred URL for this page (defaults to page path)
                  </p>
                </div>

                {/* Preview */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="text-sm font-semibold text-blue-600">
                      {formData.title || "Page Title"}
                    </div>
                    <div className="text-xs text-green-700">
                      {formData.canonicalUrl || editingPage}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formData.description || "Meta description will appear here"}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                    setEditingPage("");
                    setSelectedPage("");
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save SEO Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Select a page to manage SEO settings</p>
                <p className="text-sm text-gray-500">
                  Choose a page from the list to edit its SEO metadata
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-navy">{COMMON_PAGES.length}</div>
            <div className="text-sm text-gray-600">Total Pages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(seoSettings).length}
            </div>
            <div className="text-sm text-gray-600">Pages with SEO</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {COMMON_PAGES.length - Object.keys(seoSettings).length}
            </div>
            <div className="text-sm text-gray-600">Pages without SEO</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

