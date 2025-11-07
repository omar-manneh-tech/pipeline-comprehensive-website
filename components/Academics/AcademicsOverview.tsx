/**
 * Academics Overview Component
 * Introduction to academic programs
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GraduationCap, BookOpen, Users, Award } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const overviewStats = [
  {
    icon: GraduationCap,
    number: "3",
    title: "Program Tracks",
    description: "Science, Commerce, and Arts",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: BookOpen,
    number: "30+",
    title: "Subjects",
    description: "Comprehensive curriculum coverage",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Users,
    number: "150+",
    title: "Qualified Teachers",
    description: "Experienced educators",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Award,
    number: "95%",
    title: "WASSCE Pass Rate",
    description: "Consistent excellence",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function AcademicsOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Academic Excellence"
          description="Comprehensive senior secondary education preparing students for success"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="space-y-6"
          >
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                At Daddy Jobe Comprehensive School, we offer a rigorous senior secondary education program designed to prepare students for the West African Senior School Certificate Examination (WASSCE) and successful university admission.
              </p>
              <p>
                Our comprehensive curriculum covers three distinct academic tracks: Science, Commerce, and Arts, each carefully designed to provide students with the knowledge, skills, and competencies needed for their chosen career paths.
              </p>
              <p className="font-medium text-navy">
                With state-of-the-art facilities, experienced teachers, and a supportive learning environment, we ensure every student reaches their full academic potential.
              </p>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/academics/science_lab.png"
              alt="Academic Excellence at Daddy Jobe"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {overviewStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="group"
              >
                <div className="rounded-lg p-6 text-center hover:shadow-lg shadow-md transition-all h-full bg-white">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full border-2 border-blue-400/80 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                      <Icon className="h-8 w-8 text-navy transition-transform duration-500 group-hover:rotate-[360deg]" />
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
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

