/**
 * News Categories Component
 * Filter news by category
 */

"use client";

import { motion } from "framer-motion";
import { GraduationCap, Trophy, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const categories = [
  {
    name: "Academics",
    icon: GraduationCap,
    description: "Academic achievements, curriculum updates, and educational news",
    count: 12,
  },
  {
    name: "Achievements",
    icon: Trophy,
    description: "Student and school achievements, awards, and recognitions",
    count: 8,
  },
  {
    name: "Announcements",
    icon: BookOpen,
    description: "Important announcements, policy updates, and notices",
    count: 15,
  },
  {
    name: "Student Life",
    icon: Users,
    description: "Student activities, clubs, sports, and campus life",
    count: 10,
  },
];

export function NewsCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="News Categories"
          description={
            <div className="space-y-3 text-gray-600 max-w-3xl mx-auto leading-relaxed">
              <p>
                Browse news by category to easily explore the stories that matter most to you. Whether you are tracking academic milestones, student achievements, or important announcements, each category offers a curated collection of highlights from across our campus.
              </p>
              <p>
                Dive into the areas that align with your interests and stay informed about the programs, events, and people propelling Daddy Jobe Comprehensive School forward every day.
              </p>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-none bg-white transition-transform duration-300 hover:-translate-y-2 cursor-pointer group rounded-2xl">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="flex justify-center mb-4">
                      <motion.div
                        className="bg-blue-50 p-4 rounded-full group-hover:bg-primary/10 transition-colors"
                        whileHover={{ scale: 1.08, rotate: -3 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      >
                        <Icon className="h-8 w-8 text-primary group-hover:text-navy transition-colors" />
                      </motion.div>
                    </div>
                    <h3 className="text-base font-semibold text-navy mb-2 leading-snug">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {category.description}
                    </p>
                    <div className="text-sm font-semibold text-gold">
                      {category.count} Articles
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

