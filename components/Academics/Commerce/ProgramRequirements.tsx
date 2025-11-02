/**
 * Program Requirements Component
 * Display requirements and prerequisites for the Commerce Program
 */

"use client";

import { motion } from "framer-motion";
import { CheckCircle, BookOpen, Calculator, Award } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const requirements = [
  {
    icon: BookOpen,
    title: "Academic Prerequisites",
    description: "Strong performance in Mathematics and English at the junior secondary level. Interest in business and economics is important.",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Calculator,
    title: "Mathematical Skills",
    description: "Proficiency in basic mathematics, arithmetic, and problem-solving essential for accounting and business calculations.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Award,
    title: "WASSCE Preparation",
    description: "Commitment to regular study, completing assignments, and active participation in business projects and case studies.",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: CheckCircle,
    title: "Business Interest",
    description: "Genuine interest in business, economics, and entrepreneurship. Willingness to engage in practical business activities.",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function ProgramRequirements() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Program Requirements"
          description="What you need to succeed in the Commerce Program"
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
              The Commerce Program at Daddy Jobe Comprehensive School is designed for students with an interest in business, finance, and entrepreneurship. To ensure success, students should meet certain academic prerequisites and demonstrate commitment to their studies.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {requirements.map((req, index) => {
            const Icon = req.icon;
            return (
              <motion.div
                key={req.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="group"
              >
                <div className="border-2 border-gold rounded-lg p-6 hover:shadow-lg transition-all h-full">
                  <div className="flex items-start gap-4">
                    <div className={`${req.iconBg} p-3 rounded-lg shadow-lg flex-shrink-0 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                      <Icon className={`h-6 w-6 ${req.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-navy mb-2">
                        {req.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {req.description}
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

