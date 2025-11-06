/**
 * Navigation Management UI
 * Admin interface for managing navigation items
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
  Link as LinkIcon,
  ChevronRight,
  X,
  Save,
  Loader2,
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

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  parentId?: string;
  icon?: string;
  target: string;
  createdAt: string;
  updatedAt: string;
}

function SortableNavItem({
  item,
  childItems,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  item: NavigationItem;
  childItems?: NavigationItem[];
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
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={`mb-2 ${isDragging ? "shadow-lg" : ""} ${!item.visible ? "opacity-60" : ""}`}>
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
                    <h3 className="font-bold text-navy">{item.label}</h3>
                    {item.parentId && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Submenu
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LinkIcon className="h-4 w-4" />
                    <span className="truncate">{item.href}</span>
                    {item.target === "_blank" && (
                      <span className="text-xs text-blue-600">(New tab)</span>
                    )}
                  </div>
                  {item.icon && (
                    <span className="text-xs text-gray-500 mt-1">Icon: {item.icon}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleVisibility(item.id, !item.visible)}
                    title={item.visible ? "Hide item" : "Show item"}
                  >
                    {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(item.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {childItems && childItems.length > 0 && (
            <div className="mt-4 ml-8 border-l-2 border-gray-200 pl-4 space-y-2">
              {childItems.map((child) => (
                <SortableNavItem
                  key={child.id}
                  item={child}
                  childItems={[]}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleVisibility={onToggleVisibility}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function NavigationManagementPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    href: "",
    visible: true,
    parentId: "",
    icon: "",
    target: "_self",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: NavigationItem[] }>(
        "/admin/navigation"
      );

      if (response.success) {
        setItems(response.data);
      }
    } catch (error) {
      console.error("[Navigation Management Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = items.findIndex((item) => item.id === active.id);
      const overIndex = items.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(items, activeIndex, overIndex);
      const updatedOrder = newOrder.map((item, index) => ({
        id: item.id,
        order: index * 10,
      }));

      setItems(newOrder);

      try {
        await apiClient.put("/admin/navigation/reorder", { items: updatedOrder });
      } catch (error) {
        console.error("[Reorder Error]", error);
        fetchItems();
      }
    }
  };

  const handleEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        href: item.href,
        visible: item.visible,
        parentId: item.parentId || "",
        icon: item.icon || "",
        target: item.target,
      });
      setIsNew(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      label: "",
      href: "",
      visible: true,
      parentId: "",
      icon: "",
      target: "_self",
    });
    setIsNew(true);
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        await apiClient.post("/admin/navigation", formData);
      } else if (editingItem) {
        await apiClient.put(`/admin/navigation?id=${editingItem.id}`, formData);
      }
      await fetchItems();
      setEditingItem(null);
      setIsNew(false);
    } catch (error) {
      console.error("[Save Error]", error);
      alert("Failed to save navigation item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this navigation item?")) return;

    try {
      await apiClient.delete(`/admin/navigation/${id}`);
      await fetchItems();
    } catch (error) {
      console.error("[Delete Error]", error);
      alert("Failed to delete navigation item");
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    try {
      await apiClient.put(`/admin/navigation?id=${id}`, { visible });
      await fetchItems();
    } catch (error) {
      console.error("[Toggle Visibility Error]", error);
      alert("Failed to update visibility");
    }
  };

  // Build hierarchical structure
  const topLevelItems = items.filter((item) => !item.parentId);
  const getChildren = (parentId: string) => items.filter((item) => item.parentId === parentId);

  const filteredItems = topLevelItems.filter((item) => {
    if (search) {
      return (
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.href.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Navigation Management</h1>
          <p className="text-gray-600">Manage navigation menu items</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Navigation Item
        </Button>
      </div>

      {/* Edit Modal */}
      {(editingItem || isNew) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isNew ? "Add Navigation Item" : "Edit Navigation Item"}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingItem(null);
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
                  Label <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Menu item label"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  placeholder="/about"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Item</label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">None (Top Level)</option>
                    {topLevelItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="_self">Same Tab</option>
                    <option value="_blank">New Tab</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (optional)</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Icon name (e.g., Home, User)"
                />
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
                  setEditingItem(null);
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
              placeholder="Search navigation items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Items */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading navigation items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No navigation items found</p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Navigation Item
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
              items={filteredItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredItems.map((item) => (
                <SortableNavItem
                  key={item.id}
                  item={item}
                  childItems={getChildren(item.id)}
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
            <div className="text-2xl font-bold text-navy">{items.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {items.filter((i) => i.visible).length}
            </div>
            <div className="text-sm text-gray-600">Visible</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {items.filter((i) => i.parentId).length}
            </div>
            <div className="text-sm text-gray-600">Submenu Items</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

