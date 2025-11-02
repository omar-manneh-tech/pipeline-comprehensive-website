/**
 * Library Resources Component
 * Overview of available resources
 */

"use client";

import { motion } from "framer-motion";
import { BookOpen, Library, FileText, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const resources = [
  {
    icon: BookOpen,
    title: "Physical Books",
    count: "10,000+",
    description: "Extensive collection of textbooks, reference materials, and literature",
  },
  {
    icon: FileText,
    title: "Research Journals",
    count: "500+",
    description: "Academic journals and periodicals covering all fields of study",
  },
  {
    icon: Monitor,
    title: "E-Books & Digital",
    count: "5,000+",
    description: "Digital books, online databases, and multimedia resources",
  },
  {
    icon: Library,
    title: "Study Spaces",
    count: "Multiple",
    description: "Quiet study areas, group collaboration zones, and computer stations",
  },
];

export function LibraryResources() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Library Resources"
          description="Comprehensive resources to support every field of study"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gold mb-2">
                      {resource.count}
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {resource.description}
                    </p>
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

