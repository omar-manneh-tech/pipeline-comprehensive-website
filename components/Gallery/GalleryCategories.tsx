/**
 * Gallery Categories Component
 * Filter buttons for gallery categories
 */

"use client";

import { motion } from "framer-motion";
import { Camera, GraduationCap, Trophy, Users, BookOpen, Palette } from "lucide-react";
import type { GalleryCategory } from "@/lib/data/gallery";

const categories = [
  {
    id: "all" as GalleryCategory,
    label: "All Photos",
    icon: Camera,
  },
  {
    id: "graduation" as GalleryCategory,
    label: "Graduation",
    icon: GraduationCap,
  },
  {
    id: "sports" as GalleryCategory,
    label: "Sports",
    icon: Trophy,
  },
  {
    id: "academics" as GalleryCategory,
    label: "Academics",
    icon: BookOpen,
  },
  {
    id: "culture" as GalleryCategory,
    label: "Culture",
    icon: Palette,
  },
  {
    id: "events" as GalleryCategory,
    label: "Events",
    icon: Users,
  },
];

interface GalleryCategoriesProps {
  activeCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
}

export function GalleryCategories({ activeCategory, onCategoryChange }: GalleryCategoriesProps) {
  return (
    <section className="py-12 bg-[#0b1c3f]">
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
                    ? "bg-gold text-navy border-gold shadow-lg"
                    : "bg-transparent text-white border-white/50 hover:bg-white/10"
                }`}
              >
                <div
                  className={`p-2 rounded-full border ${
                    isActive ? "border-navy bg-white/90 text-navy" : "border-white/60 bg-transparent text-white"
                  } shadow-lg transition-colors duration-300`}
                >
                  <Icon className="h-4 w-4" />
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

