/**
 * Admin Activities Dashboard
 * Displays user activities and allows CSV export
 * Protected by authentication middleware
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, RefreshCw, Filter, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { apiClient } from "@/services/api/client";

interface Activity {
  id: string;
  timestamp: string;
  action: string;
  path: string;
  sessionId: string;
  userId: string | null;
  referrer: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
}

interface ActivitiesResponse {
  success: boolean;
  data: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    action: "",
    path: "",
    startDate: "",
    endDate: "",
  });

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login?redirect=/admin/activities");
    }
  }, [router]);

  // Fetch activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.action) params.append("action", filters.action);
      if (filters.path) params.append("path", filters.path);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await apiClient.get<ActivitiesResponse>(
        `/admin/activities?${params.toString()}`
      );

      if (response.success) {
        setActivities(response.data);
        setPagination(response.pagination);
      }
    } catch (error: unknown) {
      console.error("[Admin Activities Error]", error);
      // Handle 401 Unauthorized
      if (error instanceof Error && "status" in error && (error as { status: number }).status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.push("/admin/login?redirect=/admin/activities");
      }
    } finally {
      setLoading(false);
    }
  };

  // Export CSV
  const exportCSV = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login?redirect=/admin/activities");
        return;
      }

      const params = new URLSearchParams();
      if (filters.action) params.append("action", filters.action);
      if (filters.path) params.append("path", filters.path);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await fetch(`/api/admin/activities/export/csv?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.push("/admin/login?redirect=/admin/activities");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-activities-export-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("[CSV Export Error]", error);
      alert("Failed to export CSV. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  useEffect(() => {
    fetchActivities();
  }, [pagination.page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
      page_view: "bg-blue-100 text-blue-800",
      click: "bg-green-100 text-green-800",
      form_submit: "bg-purple-100 text-purple-800",
      download: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <SectionHeader
            title="User Activities Dashboard"
            description="View and export all user activities on the website"
          />
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Type
                </label>
                <select
                  value={filters.action}
                  onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Actions</option>
                  <option value="page_view">Page View</option>
                  <option value="click">Click</option>
                  <option value="form_submit">Form Submit</option>
                  <option value="download">Download</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Path
                </label>
                <input
                  type="text"
                  value={filters.path}
                  onChange={(e) => setFilters({ ...filters, path: e.target.value })}
                  placeholder="/about, /contact, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={fetchActivities} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Apply Filters
              </Button>
              <Button
                onClick={() => {
                  setFilters({ action: "", path: "", startDate: "", endDate: "" });
                  setPagination({ ...pagination, page: 1 });
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
              <Button
                onClick={exportCSV}
                disabled={exporting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                {exporting ? "Exporting..." : "Export CSV"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activities Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Activities ({pagination.total} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading activities...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600">No activities found.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Activities will appear here once users start interacting with the website.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Timestamp
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Action
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Path
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Session ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          IP Address
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => (
                        <tr
                          key={activity.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(activity.timestamp)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(
                                activity.action
                              )}`}
                            >
                              {activity.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                            {activity.path}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">
                            {activity.sessionId.substring(0, 20)}...
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {activity.ipAddress || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page === 1}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={pagination.page >= pagination.totalPages}
                        variant="outline"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

