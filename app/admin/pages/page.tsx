/**
 * Pages Management Hub
 * Navigation hub for all page management interfaces
 */

"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  User,
  GraduationCap,
  FileText,
  BookOpen,
  Image,
  Newspaper,
  Users,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";

const PAGES = [
  {
    name: "Home",
    path: "/admin/pages/home",
    icon: Home,
    description: "Manage home page sections and content",
  },
  {
    name: "About",
    path: "/admin/pages/about",
    icon: User,
    description: "Manage about page sections and content",
  },
  {
    name: "Academics",
    path: "/admin/pages/academics",
    icon: GraduationCap,
    description: "Manage academics page sections and content",
  },
  {
    name: "Admissions",
    path: "/admin/pages/admissions",
    icon: FileText,
    description: "Manage admissions page sections and content",
  },
  {
    name: "Library",
    path: "/admin/pages/library",
    icon: BookOpen,
    description: "Manage library page sections and content",
  },
  {
    name: "Gallery",
    path: "/admin/pages/gallery",
    icon: Image,
    description: "Manage gallery page sections and content",
  },
  {
    name: "News",
    path: "/admin/pages/news",
    icon: Newspaper,
    description: "Manage news page sections and content",
  },
  {
    name: "Staff",
    path: "/admin/pages/staff",
    icon: Users,
    description: "Manage staff page sections and content",
  },
  {
    name: "Contact",
    path: "/admin/pages/contact",
    icon: Mail,
    description: "Manage contact page sections and content",
  },
  {
    name: "Campus Life",
    path: "/admin/pages/campus-life",
    icon: MapPin,
    description: "Manage campus life page sections and content",
  },
  {
    name: "Portal",
    path: "/admin/pages/portal",
    icon: Globe,
    description: "Manage portal page sections and content",
  },
];

export default function PagesManagementHub() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Pages Management</h1>
        <p className="text-gray-600">Manage content for all website pages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAGES.map((page) => {
          const Icon = page.icon;
          return (
            <Card key={page.path} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-6 w-6 text-primary" />
                  <CardTitle>{page.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{page.description}</p>
                <Button
                  onClick={() => router.push(page.path)}
                  className="w-full"
                >
                  Manage {page.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

