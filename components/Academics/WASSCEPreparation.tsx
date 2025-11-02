/**
 * WASSCE Preparation Component
 * Information about WASSCE exam preparation
 */

"use client";

import { motion } from "framer-motion";
import { Target, FileText, Clock, Award, CheckCircle } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const preparationSteps = [
  {
    icon: FileText,
    title: "Comprehensive Curriculum",
    description: "Aligned with WASSCE syllabus requirements across all subjects",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Clock,
    title: "Regular Mock Exams",
    description: "Periodic assessments and mock examinations to track progress",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Target,
    title: "Targeted Revision",
    description: "Focused revision sessions on challenging topics and past questions",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Award,
    title: "Exam Strategies",
    description: "Effective exam techniques and time management skills",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function WASSCEPreparation() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="WASSCE Preparation"
          description="Comprehensive preparation for the West African Senior School Certificate Examination"
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
              At Daddy Jobe Comprehensive School, we are committed to ensuring every student achieves excellence in the WASSCE examination. Our comprehensive preparation program combines rigorous academic instruction with strategic exam techniques.
            </p>
            <p>
              Through regular assessments, targeted revision sessions, and expert guidance from our experienced teachers, students are well-prepared to excel in their WASSCE examinations and secure admission to their preferred universities.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {preparationSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="group"
              >
                <div className="border-2 border-gold rounded-lg p-6 text-center hover:shadow-lg transition-all h-full">
                  <div className="flex justify-center mb-4">
                    <div className={`${step.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                      <Icon className={`h-8 w-8 ${step.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
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

