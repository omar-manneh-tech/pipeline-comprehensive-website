/**
 * Core Subjects Component
 * Display core science subjects
 */

"use client";

import { motion } from "framer-motion";
import { BookOpen, Calculator, Atom, FlaskConical, Dna } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const coreSubjects = [
  {
    icon: Calculator,
    title: "Mathematics",
    description: "Advanced mathematics covering algebra, geometry, trigonometry, calculus, and statistics. Essential for all science disciplines.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: BookOpen,
    title: "English Language",
    description: "Strong communication skills for scientific writing, presentations, and academic discourse in tertiary education.",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Atom,
    title: "Physics",
    description: "Study of matter, motion, energy, and force. Topics include mechanics, thermodynamics, electricity, magnetism, and modern physics.",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: FlaskConical,
    title: "Chemistry",
    description: "Understanding chemical principles, reactions, and compounds. Laboratory work emphasizes practical application of chemical concepts.",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
  {
    icon: Dna,
    title: "Biology",
    description: "Comprehensive study of living organisms, cells, genetics, ecology, and human anatomy. Laboratory sessions enhance understanding.",
    iconBg: "bg-gradient-to-br from-red-500 to-red-700",
    iconColor: "text-white",
  },
];

export function CoreSubjects() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Core Subjects"
          description="Essential subjects forming the foundation of the Science Program"
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

