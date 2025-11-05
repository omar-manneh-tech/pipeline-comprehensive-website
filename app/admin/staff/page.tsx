/**
 * Staff Management Page
 * List view for staff members with drag-and-drop reordering
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  GripVertical,
  Mail,
  Phone,
  GraduationCap,
  Building2,
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

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  position: string;
  bio: string;
  image?: string;
  email?: string;
  phone?: string;
  qualifications: string[];
  experience?: number;
  order: number;
  published: boolean;
  createdAt: string;
}

function SortableStaffItem({
  staff,
  onEdit,
  onDelete,
  onView,
}: {
  staff: StaffMember;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: staff.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={`mb-4 ${isDragging ? "shadow-lg" : ""}`}>
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

            {/* Staff Image */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold flex-shrink-0">
              {staff.image ? (
                <Image
                  src={staff.image}
                  alt={staff.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Staff Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-navy mb-1">
                    {staff.name}
                  </h3>
                  <p className="text-sm text-gold font-semibold mb-2">
                    {staff.position}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{staff.role}</span>
                      {staff.department && (
                        <span className="text-gray-400">• {staff.department}</span>
                      )}
                    </div>
                    {staff.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                    )}
                    {staff.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{staff.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      staff.published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {staff.published ? "Published" : "Draft"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(staff.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(staff.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(staff.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

export default function StaffManagementPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [publishedFilter, setPublishedFilter] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchStaff();
  }, [roleFilter, publishedFilter]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter !== "All") params.append("role", roleFilter);
      if (publishedFilter !== null) params.append("published", publishedFilter);

      const response = await apiClient.get<{ success: boolean; data: StaffMember[] }>(
        `/admin/staff?${params.toString()}`
      );

      if (response.success) {
        let filteredStaff = response.data;
        if (search) {
          filteredStaff = filteredStaff.filter(
            (member) =>
              member.name.toLowerCase().includes(search.toLowerCase()) ||
              member.position.toLowerCase().includes(search.toLowerCase()) ||
              member.bio.toLowerCase().includes(search.toLowerCase())
          );
        }
        setStaff(filteredStaff);
      }
    } catch (error) {
      console.error("[Staff Management Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = staff.findIndex((item) => item.id === active.id);
      const newIndex = staff.findIndex((item) => item.id === over.id);

      const newStaff = arrayMove(staff, oldIndex, newIndex);
      setStaff(newStaff);

      // Update order in database
      try {
        await apiClient.put("/admin/staff/reorder", {
          items: newStaff.map((item, index) => ({
            id: item.id,
            order: index,
          })),
        });
      } catch (error) {
        console.error("[Reorder Error]", error);
        // Revert on error
        fetchStaff();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      await apiClient.delete(`/admin/staff/${id}`);
      fetchStaff();
    } catch (error) {
      console.error("[Delete Error]", error);
      alert("Failed to delete staff member");
    }
  };

  const handlePublishToggle = async (member: StaffMember) => {
    try {
      await apiClient.put(`/admin/staff/${member.id}`, {
        published: !member.published,
      });
      fetchStaff();
    } catch (error) {
      console.error("[Publish Toggle Error]", error);
      alert("Failed to update staff member");
    }
  };

  const filteredStaff = staff.filter((member) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        member.name.toLowerCase().includes(searchLower) ||
        member.position.toLowerCase().includes(searchLower) ||
        member.bio.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Staff Management</h1>
          <p className="text-gray-600">
            Manage staff members and their display order
          </p>
        </div>
        <Button onClick={() => router.push("/admin/staff/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search staff by name, position, or bio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">All Roles</option>
                <option value="Faculty">Faculty</option>
                <option value="Administrative">Administrative</option>
                <option value="Support">Support</option>
              </select>
              <select
                value={publishedFilter || "All"}
                onChange={(e) =>
                  setPublishedFilter(
                    e.target.value === "All" ? null : e.target.value
                  )
                }
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

      {/* Staff List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading staff members...</p>
        </div>
      ) : filteredStaff.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 mb-4">No staff members found</p>
            <Button onClick={() => router.push("/admin/staff/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Staff Member
            </Button>
          </CardContent>
        </Card>
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
              items={filteredStaff.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredStaff.map((member) => (
                <SortableStaffItem
                  key={member.id}
                  staff={member}
                  onEdit={(id) => router.push(`/admin/staff/${id}/edit`)}
                  onDelete={handleDelete}
                  onView={(id) => router.push(`/admin/staff/${id}`)}
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
            <div className="text-2xl font-bold text-navy">{staff.length}</div>
            <div className="text-sm text-gray-600">Total Staff</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {staff.filter((s) => s.published).length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {staff.filter((s) => !s.published).length}
            </div>
            <div className="text-sm text-gray-600">Draft</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

