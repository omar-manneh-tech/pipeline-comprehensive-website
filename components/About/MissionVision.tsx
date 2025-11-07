/**
 * Mission & Vision Component
 * School's mission and vision statements
 */

"use client";

import { motion } from "framer-motion";
import { Target, Eye, Award, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const missionVision = [
  {
    icon: Target,
    title: "Our Mission",
    points: [
      "Provide quality senior secondary education that empowers students with knowledge, skills, and values for excellence and responsible citizenship.",
      "Create a nurturing environment that fosters discipline, integrity, and a lifelong love for learning in every student.",
      "Celebrate curiosity and mentor learners to discover their unique purpose while building resilience for a changing world.",
    ],
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    icon: Eye,
    title: "Our Vision",
    points: [
      "Stand as The Gambia's premier senior secondary institution, producing graduates who excel in higher education and serve their communities with integrity.",
      "Cultivate a vibrant, innovative learning community where students lead with empathy and strong moral character.",
      "Inspire every learner to pursue bold dreams and create lasting impact locally and globally.",
    ],
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    icon: Award,
    title: "Our Commitment",
    points: [
      "Maintain the highest educational standards with modern facilities, qualified teachers, and a supportive community.",
      "Foster a culture of collaboration, respect, and continuous growth for students and staff alike.",
      "Ensure every student feels seen, supported, and motivated to turn aspirations into meaningful achievements.",
    ],
    iconBg: "bg-gold",
    iconColor: "text-white",
  },
];

export function MissionVision() {
  return (
    <section className="py-20 bg-navy/95">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Mission, Vision & Commitment"
          description="The principles that guide everything we do"
          titleClassName="text-white"
          descriptionClassName="text-white/80"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {missionVision.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="h-full border-2 border-blue-200/20 bg-gradient-to-br from-[#020b26] via-[#031132] to-[#020922] backdrop-blur-sm hover:shadow-xl hover:shadow-blue-400/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className={`${item.iconBg} p-4 rounded-full shadow-lg shadow-black/40 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 ${item.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 text-center drop-shadow-lg">
                      {item.title}
                    </h3>
                    <ul className="space-y-3 text-white/85 text-sm">
                      {item.points.map((point, pointIndex) => (
                        <motion.li
                          key={point}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={viewportConfig}
                          transition={{ ...transitions.default, delay: index * 0.1 + pointIndex * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="h-4 w-4 text-gold mt-1 flex-shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
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

