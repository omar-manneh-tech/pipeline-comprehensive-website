/**
 * Mission & Vision Component
 * School's mission and vision statements
 */

"use client";

import { motion } from "framer-motion";
import { Target, Eye, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const missionVision = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To provide quality senior secondary education that empowers students with knowledge, skills, and values necessary for academic excellence, personal growth, and responsible citizenship. We are committed to creating a nurturing learning environment that fosters discipline, integrity, and excellence in every student.",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To be the premier senior secondary institution in The Gambia, recognized for producing well-rounded graduates who excel in higher education, contribute meaningfully to society, and uphold the highest standards of excellence, integrity, and service.",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    icon: Award,
    title: "Our Commitment",
    description:
      "We are committed to maintaining the highest standards of education, providing modern facilities, qualified teachers, and a supportive community that enables every student to achieve their full potential and succeed in their academic and personal endeavors.",
    iconBg: "bg-gold",
    iconColor: "text-white",
  },
];

export function MissionVision() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Mission, Vision & Commitment"
          description="The principles that guide everything we do"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {missionVision.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className={`${item.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 ${item.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-navy mb-4 text-center">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {item.description}
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

