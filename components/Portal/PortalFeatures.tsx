/**
 * Portal Features Component
 * Display portal features and capabilities
 */

"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, FileText, MessageSquare, Award, Clock, CheckCircle, Download } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const portalFeatures = [
  {
    icon: BookOpen,
    title: "Academic Records",
    description: "View your grades, transcripts, and academic performance history",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Calendar,
    title: "Class Schedule",
    description: "Access your class timetable, exam schedules, and important dates",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Clock,
    title: "Attendance Tracking",
    description: "Monitor your attendance records and view attendance statistics",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: FileText,
    title: "Assignments & Results",
    description: "Submit assignments online and view assignment results and feedback",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
  {
    icon: MessageSquare,
    title: "Announcements",
    description: "Stay updated with school announcements, news, and important notices",
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    iconColor: "text-white",
  },
  {
    icon: Award,
    title: "Achievements",
    description: "View your academic achievements, awards, and certificates",
    iconBg: "bg-gradient-to-br from-red-500 to-red-700",
    iconColor: "text-white",
  },
  {
    icon: Download,
    title: "Document Downloads",
    description: "Download academic reports, certificates, and other important documents",
    iconBg: "bg-gradient-to-br from-teal-500 to-teal-700",
    iconColor: "text-white",
  },
  {
    icon: CheckCircle,
    title: "Fee Payments",
    description: "View fee statements, payment history, and make online payments",
    iconBg: "bg-gradient-to-br from-orange-500 to-orange-700",
    iconColor: "text-white",
  },
];

export function PortalFeatures() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Portal Features"
          description="Comprehensive features to manage your academic information"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {portalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="group"
              >
                <div className="border-2 border-gold rounded-lg p-6 hover:shadow-lg transition-all h-full">
                  <div className="flex items-start gap-4">
                    <div className={`${feature.iconBg} p-3 rounded-lg shadow-lg flex-shrink-0 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-navy mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {feature.description}
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

