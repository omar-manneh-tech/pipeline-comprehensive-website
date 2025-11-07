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
    <section className="py-20 bg-gradient-to-br from-[#0c1d42] via-[#112a58] to-[#0c1d42]">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Staff Excellence"
          description={
            <div className="space-y-3 text-white/80 max-w-3xl mx-auto leading-relaxed">
              <p>
                Our commitment to quality education through qualified professionals goes far beyond academic credentials. Every member of the Daddy Jobe team pursues continuous growth to bring fresh insight, innovation, and compassion into the classroom.
              </p>
              <p>
                With advanced degrees, specialized certifications, and years of experience, they craft lessons that ignite curiosity while fostering resilience, integrity, and leadership in every student.
              </p>
              <p>
                This dedication to excellence creates learning experiences that empower our learners to dream boldly, think critically, and excel confidently in whatever path they choose.
              </p>
            </div>
          }
          titleClassName="text-white drop-shadow-lg"
          descriptionClassName="text-white/80"
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
                <Card className="h-full bg-white/10 backdrop-blur-xl border border-white/15 hover:border-white/35 transition-all duration-300 text-center group shadow-[0_18px_45px_rgba(2,12,35,0.35)] hover:shadow-[0_28px_65px_rgba(255,255,255,0.25)]">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-center">
                      <div className={`p-4 rounded-full border border-white/40 bg-white/15 shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 text-white transition-transform duration-500 group-hover:text-gold group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-gold">
                      {stat.number}
                    </div>
                    <h3 className="text-xl font-bold text-white drop-shadow">
                      {stat.title}
                    </h3>
                    <p className="text-white/80 text-sm">
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

