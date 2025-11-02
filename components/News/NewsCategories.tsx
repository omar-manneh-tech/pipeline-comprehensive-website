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
          description="Browse news by category"
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
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2">
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

