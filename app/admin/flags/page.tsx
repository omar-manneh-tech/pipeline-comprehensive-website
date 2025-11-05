/**
 * Feature Flags Admin UI
 * Admin interface for managing feature toggles
 */

"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/services/api/client";

interface FeatureToggle {
  id: string;
  key: string;
  enabled: boolean;
  description?: string;
  updatedAt: string;
}

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureToggle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingFlag, setEditingFlag] = useState<FeatureToggle | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    key: "",
    enabled: true,
    description: "",
  });

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: FeatureToggle[] }>(
        "/admin/feature-flags"
      );

      if (response.success) {
        setFlags(response.data);
      }
    } catch (error) {
      console.error("[Feature Flags Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingFlag(null);
    setFormData({
      key: "",
      enabled: true,
      description: "",
    });
    setIsNew(true);
  };

  const handleEdit = (flag: FeatureToggle) => {
    setEditingFlag(flag);
    setFormData({
      key: flag.key,
      enabled: flag.enabled,
      description: flag.description || "",
    });
    setIsNew(false);
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        await apiClient.post("/admin/feature-flags", formData);
      } else if (editingFlag) {
        await apiClient.put(`/admin/feature-flags?key=${editingFlag.key}`, formData);
      }
      await fetchFlags();
      setEditingFlag(null);
      setIsNew(false);
    } catch (error) {
      console.error("[Save Error]", error);
      alert("Failed to save feature flag");
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Are you sure you want to delete this feature flag?")) return;

    try {
      // Note: We'll need to add DELETE endpoint if not exists
      await apiClient.put(`/admin/feature-flags?key=${key}`, { enabled: false });
      await fetchFlags();
    } catch (error) {
      console.error("[Delete Error]", error);
      alert("Failed to delete feature flag");
    }
  };

  const handleToggle = async (key: string, enabled: boolean) => {
    try {
      await apiClient.put(`/admin/feature-flags?key=${key}`, { enabled: !enabled });
      await fetchFlags();
    } catch (error) {
      console.error("[Toggle Error]", error);
      alert("Failed to toggle feature flag");
    }
  };

  const filteredFlags = flags.filter((flag) => {
    if (search) {
      return (
        flag.key.toLowerCase().includes(search.toLowerCase()) ||
        flag.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Feature Flags</h1>
          <p className="text-gray-600">Manage feature toggles and site functionality</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Feature Flag
        </Button>
      </div>

      {/* Edit Modal */}
      {(editingFlag || isNew) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isNew ? "Add Feature Flag" : "Edit Feature Flag"}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingFlag(null);
                    setIsNew(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="feature_key_name"
                  disabled={!isNew}
                  className={!isNew ? "bg-gray-100" : ""}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isNew
                    ? "Unique identifier for the feature (e.g., search, blog, gallery)"
                    : "Key cannot be changed"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this feature flag controls"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                  Enabled
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setEditingFlag(null);
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

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search feature flags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading feature flags...</p>
        </div>
      ) : filteredFlags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No feature flags found</p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Feature Flag
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFlags.map((flag) => (
            <Card key={flag.id} className={`${!flag.enabled ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-navy">{flag.key}</h3>
                      <button
                        onClick={() => handleToggle(flag.key, flag.enabled)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                          flag.enabled
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {flag.enabled ? (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            <span className="text-sm font-medium">Enabled</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            <span className="text-sm font-medium">Disabled</span>
                          </>
                        )}
                      </button>
                    </div>
                    {flag.description && (
                      <p className="text-sm text-gray-600 mb-2">{flag.description}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Last updated: {new Date(flag.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(flag)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(flag.key)}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-navy">{flags.length}</div>
            <div className="text-sm text-gray-600">Total Flags</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {flags.filter((f) => f.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Enabled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {flags.filter((f) => !f.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Disabled</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

