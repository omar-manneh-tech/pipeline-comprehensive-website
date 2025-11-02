/**
 * Elective Subjects Component
 * Display elective science subjects
 */

"use client";

import { motion } from "framer-motion";
import { Calculator, Globe, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const electiveSubjects = [
  {
    icon: Calculator,
    title: "Further Mathematics",
    description: "Advanced mathematical topics including calculus, linear algebra, and complex numbers. Recommended for students pursuing Engineering and advanced sciences.",
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    iconColor: "text-white",
  },
  {
    icon: Leaf,
    title: "Agricultural Science",
    description: "Study of agricultural principles, crop production, animal husbandry, and sustainable farming practices. Useful for agricultural science and related fields.",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Globe,
    title: "Geography",
    description: "Understanding physical geography, human geography, and environmental systems. Complements science studies with earth science perspectives.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
];

export function ElectiveSubjects() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Elective Subjects"
          description="Additional subjects to enhance your science specialization"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

