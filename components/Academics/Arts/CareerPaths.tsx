/**
 * Career Paths Component
 * Display career opportunities for arts students
 */

"use client";

import { motion } from "framer-motion";
import { Scale, GraduationCap, Newspaper, Landmark, Globe, Users } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const careerPaths = [
  {
    icon: Scale,
    title: "Law",
    description: "Become a lawyer, judge, or legal advisor. Study law at university and pursue careers in legal practice, judiciary, or legal consultancy.",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Become a teacher, lecturer, or education administrator. Share knowledge and shape future generations through teaching.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Newspaper,
    title: "Journalism",
    description: "Pursue careers in journalism, media, broadcasting, or communications. Report news, write articles, or work in media production.",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Landmark,
    title: "Public Administration",
    description: "Work in government agencies, public service, or policy-making. Contribute to governance and public service delivery.",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
  {
    icon: Globe,
    title: "International Relations",
    description: "Pursue careers in diplomacy, foreign service, or international organizations. Work on global issues and international cooperation.",
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    iconColor: "text-white",
  },
  {
    icon: Users,
    title: "Social Services",
    description: "Work in social work, community development, or non-profit organizations. Help communities and advocate for social change.",
    iconBg: "bg-gradient-to-br from-red-500 to-red-700",
    iconColor: "text-white",
  },
];

export function CareerPaths() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Career Paths"
          description="Exciting career opportunities available to Arts Program graduates"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {careerPaths.map((career, index) => {
            const Icon = career.icon;
            return (
              <motion.div
                key={career.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="group"
              >
                <div className="border-2 border-gold rounded-lg p-6 hover:shadow-lg transition-all h-full">
                  <div className="flex items-start gap-4">
                    <div className={`${career.iconBg} p-3 rounded-lg shadow-lg flex-shrink-0 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                      <Icon className={`h-6 w-6 ${career.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-navy mb-2">
                        {career.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {career.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

