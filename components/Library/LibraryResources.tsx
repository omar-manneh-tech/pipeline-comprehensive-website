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
import { useCountUp } from "@/hooks/useCountUp";

const resources = [
  {
    icon: BookOpen,
    title: "Physical Books",
    count: "10,000+",
    number: 10000,
    suffix: "+",
    description: "Extensive collection of textbooks, reference materials, and literature",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: FileText,
    title: "Research Journals",
    count: "500+",
    number: 500,
    suffix: "+",
    description: "Academic journals and periodicals covering all fields of study",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Monitor,
    title: "E-Books & Digital",
    count: "5,000+",
    number: 5000,
    suffix: "+",
    description: "Digital books, online databases, and multimedia resources",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Library,
    title: "Study Spaces",
    count: "Multiple",
    number: null, // No number counting for this
    suffix: "",
    description: "Quiet study areas, group collaboration zones, and computer stations",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

function ResourceCard({ resource, Icon, index }: { resource: typeof resources[0]; Icon: React.ComponentType<{ className?: string }>; index: number }) {
  const hasNumber = resource.number !== null;
  const countUpResult = hasNumber
    ? useCountUp({ end: resource.number!, duration: 2000, suffix: resource.suffix })
    : null;

  return (
    <div ref={hasNumber && countUpResult ? countUpResult.ref : undefined}>
      <Card className="h-full border-2 border-gold hover:shadow-lg transition-all group">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className={`${resource.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
              <Icon className={`h-8 w-8 ${resource.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gold mb-2">
            {hasNumber && countUpResult ? countUpResult.formattedCount : resource.count}
          </div>
          <h3 className="text-xl font-bold text-navy mb-3">
            {resource.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {resource.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

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
                <ResourceCard resource={resource} Icon={Icon} index={index} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

