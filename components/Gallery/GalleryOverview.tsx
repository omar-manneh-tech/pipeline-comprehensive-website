/**
 * Gallery Overview Component
 * Introduction to the gallery
 */

"use client";

import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, Smile, Award } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const overviewPoints = [
  {
    icon: Camera,
    title: "School Events",
    description: "Graduations, assemblies, and special ceremonies",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: ImageIcon,
    title: "Student Activities",
    description: "Sports, clubs, debates, and cultural celebrations",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Smile,
    title: "Campus Life",
    description: "Daily life, learning moments, and student achievements",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Award,
    title: "Achievements",
    description: "Awards, recognitions, and outstanding accomplishments",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function GalleryOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Our Gallery"
          description="A visual journey through life at Daddy Jobe Comprehensive School"
        />

        <div className="max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="text-center space-y-4 text-gray-700 leading-relaxed"
          >
            <p>
              Our photo gallery captures the vibrant spirit, achievements, and daily life of Daddy Jobe Comprehensive School. From academic excellence to extracurricular activities, from graduation ceremonies to cultural celebrations — every moment tells a story of growth, learning, and success.
            </p>
            <p>
              Browse through our collection of photographs showcasing students, teachers, events, and the beautiful campus that makes our school a special place to learn and grow.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {overviewPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="group"
              >
                <div className="border-2 border-gold rounded-lg p-6 text-center hover:shadow-lg transition-all h-full">
                  <div className="flex justify-center mb-4">
                    <div className={`${point.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                      <Icon className={`h-8 w-8 ${point.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

