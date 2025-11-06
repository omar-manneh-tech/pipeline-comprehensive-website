/**
 * Admin Dashboard
 * Main dashboard hub with statistics and overview
 */

"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Image,
  Newspaper,
  TrendingUp,
  Eye,
  Calendar,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/services/api/client";

interface DashboardStats {
  blogPosts: {
    total: number;
    published: number;
    drafts: number;
  };
  staffMembers: {
    total: number;
    published: number;
  };
  galleryItems: {
    total: number;
    published: number;
  };
  newsEvents: {
    total: number;
    published: number;
    upcoming: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // For now, we'll fetch stats from individual endpoints
      // In the future, we can create a dedicated /api/admin/dashboard/stats endpoint
      
      const [blogRes, staffRes, galleryRes, newsRes] = await Promise.allSettled([
        apiClient.get<{ success: boolean; data: Array<Record<string, unknown>>; pagination?: { total: number } }>("/admin/blog"),
        apiClient.get<{ success: boolean; data: Array<Record<string, unknown>>; pagination?: { total: number } }>("/admin/staff"),
        apiClient.get<{ success: boolean; data: Array<Record<string, unknown>>; pagination?: { total: number } }>("/admin/gallery"),
        apiClient.get<{ success: boolean; data: Array<Record<string, unknown>>; pagination?: { total: number } }>("/admin/news"),
      ]);

      const blogData = blogRes.status === "fulfilled" ? blogRes.value : { data: [], pagination: { total: 0 } };
      const staffData = staffRes.status === "fulfilled" ? staffRes.value : { data: [], pagination: { total: 0 } };
      const galleryData = galleryRes.status === "fulfilled" ? galleryRes.value : { data: [], pagination: { total: 0 } };
      const newsData = newsRes.status === "fulfilled" ? newsRes.value : { data: [], pagination: { total: 0 } };

      const blogPosts = Array.isArray(blogData.data) ? blogData.data : [];
      const staffMembers = Array.isArray(staffData.data) ? staffData.data : [];
      const galleryItems = Array.isArray(galleryData.data) ? galleryData.data : [];
      const newsEvents = Array.isArray(newsData.data) ? newsData.data : [];

      const publishedBlogs = blogPosts.filter((p: Record<string, unknown>) => p.published === true);
      const publishedStaff = staffMembers.filter((s: Record<string, unknown>) => s.published === true);
      const publishedGallery = galleryItems.filter((g: Record<string, unknown>) => g.published === true);
      const publishedNews = newsEvents.filter((n: Record<string, unknown>) => n.published === true);

      // Get upcoming events (events with eventDate in the future)
      const now = new Date();
      const upcomingEvents = newsEvents.filter(
        (n: { type: string; eventDate?: string }) =>
          n.type === "event" && n.eventDate && new Date(n.eventDate) > now
      );

      setStats({
        blogPosts: {
          total: blogPosts.length,
          published: publishedBlogs.length,
          drafts: blogPosts.length - publishedBlogs.length,
        },
        staffMembers: {
          total: staffMembers.length,
          published: publishedStaff.length,
        },
        galleryItems: {
          total: galleryItems.length,
          published: publishedGallery.length,
        },
        newsEvents: {
          total: newsEvents.length,
          published: publishedNews.length,
          upcoming: upcomingEvents.length,
        },
        recentActivity: [],
      });
    } catch (error) {
      console.error("[Dashboard Error]", error);
      // Set default stats on error
      setStats({
        blogPosts: { total: 0, published: 0, drafts: 0 },
        staffMembers: { total: 0, published: 0 },
        galleryItems: { total: 0, published: 0 },
        newsEvents: { total: 0, published: 0, upcoming: 0 },
        recentActivity: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard statistics.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Blog Posts",
      value: stats.blogPosts.total,
      subtitle: `${stats.blogPosts.published} published, ${stats.blogPosts.drafts} drafts`,
      icon: BookOpen,
      color: "bg-blue-500",
      href: "/admin/blog",
    },
    {
      title: "Staff Members",
      value: stats.staffMembers.total,
      subtitle: `${stats.staffMembers.published} published`,
      icon: Users,
      color: "bg-purple-500",
      href: "/admin/staff",
    },
    {
      title: "Gallery Items",
      value: stats.galleryItems.total,
      subtitle: `${stats.galleryItems.published} published`,
      icon: Image,
      color: "bg-green-500",
      href: "/admin/gallery",
    },
    {
      title: "News & Events",
      value: stats.newsEvents.total,
      subtitle: `${stats.newsEvents.published} published, ${stats.newsEvents.upcoming} upcoming`,
      icon: Newspaper,
      color: "bg-orange-500",
      href: "/admin/news",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the CMS Admin Panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => (window.location.href = card.href)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`${card.color} p-2 rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/blog/new"
                className="block px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">Create New Blog Post</p>
                    <p className="text-sm text-gray-600">Write and publish a new article</p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/staff/new"
                className="block px-4 py-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Add Staff Member</p>
                    <p className="text-sm text-gray-600">Add a new staff profile</p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/gallery/upload"
                className="block px-4 py-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Image className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Upload Gallery Images</p>
                    <p className="text-sm text-gray-600">Add new images to gallery</p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/news/new"
                className="block px-4 py-3 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Create News or Event</p>
                    <p className="text-sm text-gray-600">Publish news or schedule an event</p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Eye className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs mt-1">Activity will appear here as you manage content</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

