/**
 * Admin Layout Component
 * Shared layout for all admin pages with sidebar navigation
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Image,
  Newspaper,
  Activity,
  LogOut,
  Menu,
  X,
  Settings,
  Folder,
  Navigation,
  Link as LinkIcon,
  ToggleLeft,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Page Content",
    href: "/admin/pages/home",
    icon: Home,
  },
  {
    label: "Media Library",
    href: "/admin/media",
    icon: Folder,
  },
  {
    label: "Navigation",
    href: "/admin/navigation",
    icon: Navigation,
  },
  {
    label: "Footer",
    href: "/admin/footer",
    icon: LinkIcon,
  },
  {
    label: "Blog Posts",
    href: "/admin/blog",
    icon: BookOpen,
  },
  {
    label: "Staff",
    href: "/admin/staff",
    icon: Users,
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    label: "News & Events",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    label: "Feature Flags",
    href: "/admin/flags",
    icon: ToggleLeft,
  },
  {
    label: "User Activities",
    href: "/admin/activities",
    icon: Activity,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const userStr = localStorage.getItem("admin_user");

    if (!token) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setAdminUser(user);
      } catch {
        // Invalid user data
      }
    }

    // Check when window gains focus (in case token was cleared in another tab)
    const handleFocus = () => {
      const currentToken = localStorage.getItem("admin_token");
      if (!currentToken) {
        router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-navy text-white z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-300">Daddy Jobe CMS</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-gold text-navy font-semibold"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-white/10">
            {adminUser && (
              <div className="mb-3 px-4 py-2 bg-white/5 rounded-lg">
                <p className="text-sm font-medium text-white">{adminUser.name}</p>
                <p className="text-xs text-gray-400 truncate">{adminUser.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-300 hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              {adminUser && (
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
                  <p className="text-xs text-gray-500">{adminUser.email}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

