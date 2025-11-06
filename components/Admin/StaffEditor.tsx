/**
 * Staff Editor Component
 * Shared component for creating and editing staff members
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Upload, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/services/api/client";
import Image from "next/image";

interface StaffEditorProps {
  staffId?: string;
}

export function StaffEditor({ staffId }: StaffEditorProps) {
  const router = useRouter();
  const isNew = !staffId || staffId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    role: "Faculty",
    department: "",
    position: "",
    bio: "",
    image: "",
    email: "",
    phone: "",
    qualifications: [] as string[],
    experience: undefined as number | undefined,
    published: false,
  });

  const [newQualification, setNewQualification] = useState("");

  useEffect(() => {
    if (!isNew && staffId) {
      fetchStaff();
    }
  }, [staffId, isNew]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(
        `/admin/staff/${staffId}`
      );

      if (response.success) {
        const staff = response.data;
        setFormData({
          name: typeof staff.name === "string" ? staff.name : "",
          role: typeof staff.role === "string" ? staff.role : "Faculty",
          department: typeof staff.department === "string" ? staff.department : "",
          position: typeof staff.position === "string" ? staff.position : "",
          bio: typeof staff.bio === "string" ? staff.bio : "",
          image: typeof staff.image === "string" ? staff.image : "",
          email: typeof staff.email === "string" ? staff.email : "",
          phone: typeof staff.phone === "string" ? staff.phone : "",
          qualifications: Array.isArray(staff.qualifications)
            ? staff.qualifications
            : [],
          experience: typeof staff.experience === "number" ? staff.experience : undefined,
          published: typeof staff.published === "boolean" ? staff.published : false,
        });
      }
    } catch (error) {
      console.error("[Fetch Error]", error);
      alert("Failed to load staff member");
      router.push("/admin/staff");
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
      formData.append("folder", "staff");

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

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setFormData((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()],
      }));
      setNewQualification("");
    }
  };

  const handleRemoveQualification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (publish: boolean = false) => {
    try {
      setSaving(true);
      setErrors({});

      // Validation
      if (!formData.name.trim()) {
        setErrors({ name: "Name is required" });
        return;
      }
      if (!formData.position.trim()) {
        setErrors({ position: "Position is required" });
        return;
      }
      if (!formData.bio.trim()) {
        setErrors({ bio: "Bio is required" });
        return;
      }

      const payload = {
        ...formData,
        published: publish,
        qualifications: formData.qualifications,
      };

      if (isNew) {
        await apiClient.post("/admin/staff", payload);
      } else {
        await apiClient.put(`/admin/staff/${staffId}`, payload);
      }

      router.push("/admin/staff");
    } catch (error: unknown) {
      console.error("[Save Error]", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error as { response?: { data?: { details?: Array<{ path: string[]; message: string }>; error?: string } } };
        if (errorResponse.response?.data?.details) {
          const fieldErrors: Record<string, string> = {};
          errorResponse.response.data.details.forEach((issue: { path: string[]; message: string }) => {
          fieldErrors[issue.path[0]] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (errorResponse.response?.data?.error) {
        alert(errorResponse.response.data.error);
      } else {
        alert("Failed to save staff member");
      }
      } else {
        alert("Failed to save staff member");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading staff member...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">
            {isNew ? "Add Staff Member" : "Edit Staff Member"}
          </h1>
          <p className="text-gray-600">
            {isNew
              ? "Create a new staff member profile"
              : "Update staff member information"}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/staff")}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Faculty">Faculty</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <Input
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  placeholder="e.g., Science, Mathematics"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                placeholder="e.g., Mathematics Teacher, Principal"
                className={errors.position ? "border-red-500" : ""}
              />
              {errors.position && (
                <p className="text-sm text-red-500 mt-1">{errors.position}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Brief biography..."
                rows={4}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.bio ? "border-red-500" : ""
                }`}
              />
              {errors.bio && (
                <p className="text-sm text-red-500 mt-1">{errors.bio}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+220 XXX XXXX"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle>Qualifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                placeholder="e.g., BSc in Mathematics, PhD in Education"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddQualification();
                  }
                }}
              />
              <Button type="button" onClick={handleAddQualification}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.qualifications.length > 0 && (
              <div className="space-y-2">
                {formData.qualifications.map((qual, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-700">{qual}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveQualification(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <Input
                type="number"
                value={formData.experience || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
                placeholder="e.g., 10"
                min="0"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
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
          <Button onClick={() => handleSubmit(true)} disabled={saving}>
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
      </div>
    </div>
  );
}

