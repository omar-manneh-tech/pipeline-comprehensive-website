/**
 * Elective Subjects Component
 * Display elective arts subjects
 */

"use client";

import { motion } from "framer-motion";
import { Globe, TrendingUp, Languages, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const electiveSubjects = [
  {
    icon: Globe,
    title: "Geography",
    description: "Study of physical geography, human geography, and environmental systems. Understanding the relationship between humans and the environment.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: TrendingUp,
    title: "Economics",
    description: "Understanding economic principles, market forces, and economic policies. Useful for careers in public administration and policy.",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Languages,
    title: "French",
    description: "Learn French language skills for communication, diplomacy, and international opportunities. Opens doors to francophone countries.",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Palette,
    title: "Art",
    description: "Creative arts including drawing, painting, and artistic expression. Develops creativity and artistic skills for careers in the arts.",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function ElectiveSubjects() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Elective Subjects"
          description="Additional subjects to enhance your arts specialization"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {electiveSubjects.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <motion.div
                key={subject.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.15 }}
                className="group"
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${subject.iconBg} p-3 rounded-lg shadow-lg flex-shrink-0 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-6 w-6 ${subject.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-navy mb-2">
                          {subject.title}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {subject.description}
                        </p>
                      </div>
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

