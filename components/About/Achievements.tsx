/**
 * Achievements Component
 * School achievements and milestones
 */

"use client";

import { motion } from "framer-motion";
import { Trophy, Users, GraduationCap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { useCountUp } from "@/hooks/useCountUp";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const achievements = [
  {
    icon: Trophy,
    number: 95,
    suffix: "%",
    title: "WASSCE Pass Rate",
    description: "Consistently high pass rate in West African Senior Secondary Certification Examination",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
  {
    icon: GraduationCap,
    number: 85,
    suffix: "%",
    title: "University Admission",
    description: "Graduates successfully gain admission to universities including University of The Gambia",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Users,
    number: 2500,
    suffix: "+",
    title: "Active Students",
    description: "Serving a diverse student body across Science, Commerce, and Arts programs",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Star,
    number: 150,
    suffix: "+",
    title: "Qualified Teachers",
    description: "Dedicated and experienced educators committed to student success",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
];

interface AchievementCardProps {
  achievement: typeof achievements[0];
  index: number;
}

function AchievementCard({ achievement, index }: AchievementCardProps) {
  const Icon = achievement.icon;
  const { formattedCount, ref } = useCountUp({
    end: achievement.number,
    suffix: achievement.suffix,
    duration: 2000,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportConfig}
      transition={{ ...transitions.default, delay: index * 0.1 }}
    >
      <Card className="h-full border-2 border-gold hover:shadow-lg transition-all text-center group">
        <CardContent className="p-6">
          <div className="flex justify-center mb-4">
            <div className={`${achievement.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
              <Icon className={`h-8 w-8 ${achievement.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
            </div>
          </div>
          <motion.div
            ref={ref}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="text-4xl font-bold text-gold mb-2"
          >
            {formattedCount}
          </motion.div>
          <h3 className="text-xl font-bold text-navy mb-2">
            {achievement.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {achievement.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Achievements() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Our Achievements"
          description="Milestones that reflect our commitment to excellence"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.title} achievement={achievement} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

