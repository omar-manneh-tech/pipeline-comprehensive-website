/**
 * Core Subjects Component
 * Display core arts subjects
 */

"use client";

import { motion } from "framer-motion";
import { BookOpen, FileText, Landmark, Church, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const coreSubjects = [
  {
    icon: BookOpen,
    title: "English Language",
    description: "Advanced English communication, grammar, comprehension, and composition skills. Essential for all arts disciplines and professional communication.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: FileText,
    title: "Literature in English",
    description: "Study of literary works, poetry, prose, and drama. Develops critical thinking, analysis, and appreciation of literature from various cultures.",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Globe,
    title: "History",
    description: "Understanding historical events, movements, and their impact on society. Covers local, national, and world history with emphasis on critical analysis.",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Landmark,
    title: "Government",
    description: "Study of political systems, governance, public administration, and civic responsibilities. Essential for understanding political structures and policies.",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
  {
    icon: Church,
    title: "CRS/IRK",
    description: "Christian Religious Studies or Islamic Religious Knowledge. Study of religious principles, ethics, and moral values. Choose based on your faith.",
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    iconColor: "text-white",
  },
];

export function CoreSubjects() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Core Subjects"
          description="Essential subjects forming the foundation of the Arts Program"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {coreSubjects.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <motion.div
                key={subject.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
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

