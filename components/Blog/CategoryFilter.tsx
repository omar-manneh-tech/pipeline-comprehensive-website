/**
 * Category Filter Component
 * Filter blog posts by category
 */

"use client";

import { motion } from "framer-motion";
import { blogCategories, BlogCategory } from "@/lib/data/blog";

interface CategoryFilterProps {
  selectedCategory: BlogCategory;
  onCategoryChange: (category: BlogCategory) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {blogCategories.map((category, index) => (
        <motion.button
          key={category}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
            selectedCategory === category
              ? "bg-primary text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
}

