/**
 * Staff Excellence Component
 * Highlight staff achievements and qualifications
 */

"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const excellenceStats = [
  {
    icon: Award,
    number: "150+",
    title: "Qualified Teachers",
    description: "Degreed educators with teaching credentials",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: BookOpen,
    number: "95%",
    title: "Advanced Degrees",
    description: "Faculty with Master's or higher qualifications",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Users,
    number: "10+",
    title: "Years Experience",
    description: "Average years of teaching experience",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Star,
    number: "100%",
    title: "Certified",
    description: "All teachers hold valid teaching certificates",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function StaffExcellence() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Staff Excellence"
          description="Our commitment to quality education through qualified professionals"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {excellenceStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all text-center group">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className={`${stat.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 ${stat.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-gold mb-2">
                      {stat.number}
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2">
                      {stat.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {stat.description}
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

