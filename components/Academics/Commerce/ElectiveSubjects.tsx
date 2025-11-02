/**
 * Elective Subjects Component
 * Display elective commerce subjects
 */

"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Globe, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const electiveSubjects = [
  {
    icon: ShoppingBag,
    title: "Commerce",
    description: "Study of trade, business transactions, banking, insurance, and commercial activities. Covers retail, wholesale, and international trade principles.",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Globe,
    title: "Geography",
    description: "Understanding economic geography, resource distribution, and how geographic factors influence business and trade activities.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Landmark,
    title: "Government",
    description: "Understanding government policies, regulations, and their impact on business. Covers public administration and business-government relations.",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
];

export function ElectiveSubjects() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Elective Subjects"
          description="Additional subjects to enhance your commerce specialization"
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

