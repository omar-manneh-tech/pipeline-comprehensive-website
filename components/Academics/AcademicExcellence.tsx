/**
 * Academic Excellence Component
 * Display achievements and statistics
 */

"use client";

import { motion } from "framer-motion";
import { GraduationCap, Trophy, Star, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";
import { useCountUp } from "@/hooks/useCountUp";

const excellenceStats = [
  {
    icon: GraduationCap,
    number: 95,
    suffix: "%",
    title: "WASSCE Pass Rate",
    description: "Consistent high pass rate over the years",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Trophy,
    number: 85,
    suffix: "%",
    title: "University Admission",
    description: "Students gaining university admission",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Star,
    number: 70,
    suffix: "%",
    title: "Distinctions",
    description: "Students achieving distinction grades",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: TrendingUp,
    number: 100,
    suffix: "%",
    title: "Student Satisfaction",
    description: "Students satisfied with academic support",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

function CountUpCard({ stat, Icon }: { stat: typeof excellenceStats[0]; Icon: React.ComponentType<{ className?: string }> }) {
  const { count, ref } = useCountUp({ end: stat.number, duration: 2000 });
  
  return (
    <div ref={ref} className="rounded-lg p-6 text-center hover:shadow-lg transition-all h-full group bg-white">
      <div className="flex justify-center mb-4">
        <div className={`${stat.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
          <Icon className={`h-8 w-8 ${stat.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
        </div>
      </div>
      <div className="text-4xl font-bold text-gold mb-2">
        {count}{stat.suffix}
      </div>
      <h3 className="text-xl font-bold text-navy mb-2">
        {stat.title}
      </h3>
      <p className="text-gray-600 text-sm">
        {stat.description}
      </p>
    </div>
  );
}

export function AcademicExcellence() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Academic Excellence"
          description="Our track record of success and achievement"
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
                <CountUpCard stat={stat} Icon={Icon} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
