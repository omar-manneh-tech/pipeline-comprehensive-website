/**
 * Media Library Admin UI
 * Centralized media management interface
 */

"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Eye,
  Edit,
  Folder,
  Image as ImageIcon,
  File,
  Loader2,
  Grid,
  List,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/services/api/client";
import Image from "next/image";

interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  folder: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
  title?: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [editForm, setEditForm] = useState({
    altText: "",
    title: "",
    description: "",
  });

  const folders = ["blog", "staff", "gallery", "news", "pages", "testimonials"];

  useEffect(() => {
    fetchAssets();
  }, [folderFilter]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (folderFilter) params.append("folder", folderFilter);
      if (search) params.append("search", search);

      const response = await apiClient.get<{ success: boolean; data: MediaAsset[] }>(
        `/admin/media?${params.toString()}`
      );

      if (response.success) {
        setAssets(response.data);
      }
    } catch (error) {
      console.error("[Media Library Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      if (folderFilter) formData.append("folder", folderFilter);

      const response = await apiClient.post<{ success: boolean; data: MediaAsset }>(
        "/admin/media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success) {
        await fetchAssets();
        e.target.value = ""; // Reset input
      }
    } catch (error) {
      console.error("[Upload Error]", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;

    try {
      const response = await apiClient.delete<{ success: boolean; message?: string }>(`/admin/media/${id}`);
      if (response.success) {
        await fetchAssets();
      }
    } catch (error) {
      console.error("[Delete Error]", error);
      alert("Failed to delete media asset");
    }
  };

  const handleEdit = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setEditForm({
      altText: asset.altText || "",
      title: asset.title || "",
      description: asset.description || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingAsset) return;

    try {
      const response = await apiClient.put<{ success: boolean; data?: MediaAsset }>(`/admin/media/${editingAsset.id}`, editForm);
      if (response.success) {
        await fetchAssets();
        setEditingAsset(null);
        setSelectedAsset(null);
      }
    } catch (error) {
      console.error("[Update Error]", error);
      alert("Failed to update media asset");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (mimeType: string): boolean => {
    return mimeType.startsWith("image/");
  };

  const filteredAssets = assets.filter((asset) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        asset.filename.toLowerCase().includes(searchLower) ||
        asset.originalName.toLowerCase().includes(searchLower) ||
        asset.title?.toLowerCase().includes(searchLower) ||
        asset.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Media Library</h1>
          <p className="text-gray-600">Manage all media assets</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </>
              )}
            </Button>
          </label>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search media by name, title, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") fetchAssets();
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={folderFilter}
                onChange={(e) => setFolderFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Folders</option>
                {folders.map((folder) => (
                  <option key={folder} value={folder}>
                    {folder.charAt(0).toUpperCase() + folder.slice(1)}
                  </option>
                ))}
              </select>
              <Button variant="outline" onClick={fetchAssets}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingAsset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Edit Media Asset</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingAsset(null);
                    setEditForm({ altText: "", title: "", description: "" });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Media title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text
                  </label>
                  <Input
                    value={editForm.altText}
                    onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })}
                    placeholder="Alt text for accessibility"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Media description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setEditingAsset(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Media Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading media...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">No media assets found</p>
          <p className="text-sm text-gray-500">Upload your first media asset to get started</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="relative aspect-square bg-gray-100">
                {isImage(asset.mimeType) ? (
                  <Image
                    src={asset.url}
                    alt={asset.altText || asset.originalName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <File className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(asset);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(asset.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs font-medium text-gray-900 truncate mb-1">
                  {asset.title || asset.originalName}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Folder className="h-3 w-3" />
                    {asset.folder}
                  </span>
                  <span>{formatFileSize(asset.size)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAsset(asset)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {isImage(asset.mimeType) ? (
                      <Image
                        src={asset.url}
                        alt={asset.altText || asset.originalName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <File className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {asset.title || asset.originalName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {asset.description || asset.filename}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Folder className="h-3 w-3" />
                        {asset.folder}
                      </span>
                      <span>{formatFileSize(asset.size)}</span>
                      {asset.width && asset.height && (
                        <span>
                          {asset.width} × {asset.height}
                        </span>
                      )}
                      <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(asset);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(asset.id);
                      }}
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

      {/* Selected Asset Preview */}
      {selectedAsset && !editingAsset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedAsset.title || selectedAsset.originalName}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAsset(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {isImage(selectedAsset.mimeType) ? (
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={selectedAsset.url}
                        alt={selectedAsset.altText || selectedAsset.originalName}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                      <File className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filename</label>
                    <p className="text-sm text-gray-900">{selectedAsset.filename}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
                    <p className="text-sm text-gray-900">{selectedAsset.folder}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <p className="text-sm text-gray-900">{formatFileSize(selectedAsset.size)}</p>
                  </div>
                  {selectedAsset.width && selectedAsset.height && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                      <p className="text-sm text-gray-900">
                        {selectedAsset.width} × {selectedAsset.height}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <p className="text-sm text-gray-900 break-all">{selectedAsset.url}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                    <p className="text-sm text-gray-900">{selectedAsset.altText || "Not set"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <p className="text-sm text-gray-900">{selectedAsset.title || "Not set"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-sm text-gray-900">{selectedAsset.description || "Not set"}</p>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => handleEdit(selectedAsset)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        handleDelete(selectedAsset.id);
                        setSelectedAsset(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-navy">{assets.length}</div>
            <div className="text-sm text-gray-600">Total Assets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {assets.filter((a) => isImage(a.mimeType)).length}
            </div>
            <div className="text-sm text-gray-600">Images</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {assets.filter((a) => !isImage(a.mimeType)).length}
            </div>
            <div className="text-sm text-gray-600">Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {formatFileSize(assets.reduce((sum, a) => sum + a.size, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Size</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

