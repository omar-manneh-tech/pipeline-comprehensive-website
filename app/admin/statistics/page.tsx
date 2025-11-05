/**
 * Statistics Admin UI
 * Admin interface for managing statistics (TileGrid section)
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
  Loader2,
  X,
  Save,
  Palette,
  Type,
  Hash,
  Percent,
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

interface Statistic {
  id: string;
  number: number;
  suffix?: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Common Lucide icons for selection
const COMMON_ICONS = [
  "Users",
  "BookOpen",
  "GraduationCap",
  "Award",
  "Trophy",
  "TrendingUp",
  "UserCheck",
  "Building2",
  "Library",
  "Monitor",
  "Search",
  "Database",
  "Lightbulb",
  "Star",
  "Heart",
  "Target",
  "Zap",
  "CheckCircle",
];

// Predefined color options
const COLOR_OPTIONS = [
  { label: "Blue", bg: "bg-gradient-to-br from-blue-500 to-blue-700", text: "text-white" },
  { label: "Purple", bg: "bg-gradient-to-br from-purple-500 to-purple-700", text: "text-white" },
  { label: "Green", bg: "bg-gradient-to-br from-green-500 to-green-700", text: "text-white" },
  { label: "Yellow", bg: "bg-gradient-to-br from-yellow-400 to-yellow-600", text: "text-white" },
  { label: "Orange", bg: "bg-gradient-to-br from-orange-500 to-orange-700", text: "text-white" },
  { label: "Red", bg: "bg-gradient-to-br from-red-500 to-red-700", text: "text-white" },
  { label: "Indigo", bg: "bg-gradient-to-br from-indigo-500 to-indigo-700", text: "text-white" },
  { label: "Pink", bg: "bg-gradient-to-br from-pink-500 to-pink-700", text: "text-white" },
];

function SortableStatisticItem({
  statistic,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  statistic: Statistic;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: statistic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={`mb-4 ${isDragging ? "shadow-lg" : ""} ${!statistic.visible ? "opacity-60" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <div className={`w-16 h-16 ${statistic.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
              <span className="text-2xl font-bold">{statistic.number}{statistic.suffix || ""}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-navy mb-1">{statistic.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{statistic.description}</p>
                  <div className="flex gap-2">
                    <span className="text-xs text-gray-500">Icon: {statistic.icon}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">Color: {statistic.bgColor}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleVisibility(statistic.id, !statistic.visible)}
                    title={statistic.visible ? "Hide statistic" : "Show statistic"}
                  >
                    {statistic.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(statistic.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(statistic.id)}
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

export default function StatisticsManagementPage() {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingStatistic, setEditingStatistic] = useState<Statistic | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    number: 0,
    suffix: "",
    title: "",
    description: "",
    icon: "Users",
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
    textColor: "text-white",
    visible: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: Statistic[] }>(
        "/admin/statistics"
      );

      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("[Statistics Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = statistics.findIndex((s) => s.id === active.id);
      const overIndex = statistics.findIndex((s) => s.id === over.id);

      const newOrder = arrayMove(statistics, activeIndex, overIndex);
      const updatedOrder = newOrder.map((item, index) => ({
        id: item.id,
        order: index * 10,
      }));

      setStatistics(newOrder);

      try {
        await apiClient.put("/admin/statistics/reorder", { items: updatedOrder });
      } catch (error) {
        console.error("[Reorder Error]", error);
        fetchStatistics();
      }
    }
  };

  const handleAdd = () => {
    setEditingStatistic(null);
    setFormData({
      number: 0,
      suffix: "+",
      title: "",
      description: "",
      icon: "Users",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
      textColor: "text-white",
      visible: true,
    });
    setIsNew(true);
  };

  const handleEdit = async (id: string) => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Statistic }>(
        `/admin/statistics/${id}`
      );

      if (response.success) {
        setEditingStatistic(response.data);
        setFormData({
          number: response.data.number,
          suffix: response.data.suffix || "",
          title: response.data.title,
          description: response.data.description,
          icon: response.data.icon,
          bgColor: response.data.bgColor,
          textColor: response.data.textColor,
          visible: response.data.visible,
        });
        setIsNew(false);
      }
    } catch (error) {
      console.error("[Fetch Error]", error);
      alert("Failed to fetch statistic");
    }
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        await apiClient.post("/admin/statistics", formData);
      } else if (editingStatistic) {
        await apiClient.put(`/admin/statistics/${editingStatistic.id}`, formData);
      }
      await fetchStatistics();
      setEditingStatistic(null);
      setIsNew(false);
    } catch (error) {
      console.error("[Save Error]", error);
      alert("Failed to save statistic");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this statistic?")) return;

    try {
      await apiClient.delete(`/admin/statistics/${id}`);
      await fetchStatistics();
    } catch (error) {
      console.error("[Delete Error]", error);
      alert("Failed to delete statistic");
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    try {
      await apiClient.put(`/admin/statistics/${id}`, { visible });
      await fetchStatistics();
    } catch (error) {
      console.error("[Toggle Visibility Error]", error);
      alert("Failed to update visibility");
    }
  };

  const filteredStatistics = statistics.filter((statistic) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        statistic.title.toLowerCase().includes(searchLower) ||
        statistic.description.toLowerCase().includes(searchLower) ||
        statistic.icon.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const sortedStatistics = [...filteredStatistics].sort((a, b) => a.order - b.order);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Statistics Management</h1>
          <p className="text-gray-600">Manage statistics for the "At a Glance" section</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Statistic
        </Button>
      </div>

      {/* Edit Modal */}
      {(editingStatistic || isNew) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isNew ? "Add Statistic" : "Edit Statistic"}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingStatistic(null);
                    setIsNew(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                    placeholder="2500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suffix
                  </label>
                  <Input
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    placeholder="+, %, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {COMMON_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Students"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, bgColor: color.bg, textColor: color.text })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.bgColor === color.bg
                          ? "border-primary ring-2 ring-primary"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className={`${color.bg} w-full h-12 rounded mb-2`} />
                      <span className="text-xs font-medium text-gray-700">{color.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {formData.bgColor}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="visible"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="visible" className="text-sm font-medium text-gray-700">
                  Visible
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setEditingStatistic(null);
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
              placeholder="Search statistics by title, description, or icon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      ) : sortedStatistics.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No statistics found</p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Statistic
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
              items={sortedStatistics.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedStatistics.map((statistic) => (
                <SortableStatisticItem
                  key={statistic.id}
                  statistic={statistic}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
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
            <div className="text-2xl font-bold text-navy">{statistics.length}</div>
            <div className="text-sm text-gray-600">Total Statistics</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {statistics.filter((s) => s.visible).length}
            </div>
            <div className="text-sm text-gray-600">Visible</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {statistics.filter((s) => !s.visible).length}
            </div>
            <div className="text-sm text-gray-600">Hidden</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

