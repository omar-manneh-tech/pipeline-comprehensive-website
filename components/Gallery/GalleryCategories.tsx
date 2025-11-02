/**
 * Gallery Categories Component
 * Filter buttons for gallery categories
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, GraduationCap, Trophy, Users, BookOpen, Palette } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions } from "@/lib/animations/constants";

export type GalleryCategory = "all" | "events" | "sports" | "academics" | "culture" | "graduation";

const categories = [
  {
    id: "all" as GalleryCategory,
    label: "All Photos",
    icon: Camera,
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    id: "graduation" as GalleryCategory,
    label: "Graduation",
    icon: GraduationCap,
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    id: "sports" as GalleryCategory,
    label: "Sports",
    icon: Trophy,
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
  {
    id: "academics" as GalleryCategory,
    label: "Academics",
    icon: BookOpen,
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    id: "culture" as GalleryCategory,
    label: "Culture",
    icon: Palette,
    iconBg: "bg-gradient-to-br from-red-500 to-red-700",
    iconColor: "text-white",
  },
  {
    id: "events" as GalleryCategory,
    label: "Events",
    icon: Users,
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    iconColor: "text-white",
  },
];

interface GalleryCategoriesProps {
  activeCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
}

export function GalleryCategories({ activeCategory, onCategoryChange }: GalleryCategoriesProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <motion.button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all ${
                  isActive
                    ? "bg-primary text-white border-gold shadow-lg"
                    : "bg-white text-gray-700 border-gold hover:bg-primary/10"
                }`}
              >
                <div className={`${category.iconBg} p-2 rounded-full shadow-lg`}>
                  <Icon className={`h-4 w-4 ${category.iconColor}`} />
                </div>
                <span className="font-semibold">{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

