/**
 * Campus Facilities Component
 * Showcasing campus facilities available to students
 */

"use client";

import { motion } from "framer-motion";
import {
  Library,
  Monitor,
  UtensilsCrossed,
  Building2,
  Wifi,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

interface Facility {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const facilities: Facility[] = [
  {
    icon: Library,
    title: "Modern Library",
    description:
      "State-of-the-art library with extensive collection of books, digital resources, and quiet study spaces for students.",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    icon: Monitor,
    title: "Computer Labs",
    description:
      "Fully equipped computer laboratories with high-speed internet and modern technology for research and learning.",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    icon: UtensilsCrossed,
    title: "Cafeteria",
    description:
      "Clean and spacious cafeteria serving nutritious meals and snacks to keep students energized throughout the day.",
    iconBg: "bg-green-500",
    iconColor: "text-white",
  },
  {
    icon: Building2,
    title: "Sports Facilities",
    description:
      "Well-maintained sports facilities including football field, basketball court, and athletics track for physical activities.",
    iconBg: "bg-yellow-500",
    iconColor: "text-white",
  },
  {
    icon: Wifi,
    title: "Wi-Fi Campus",
    description:
      "High-speed Wi-Fi connectivity throughout the campus, enabling students to access online resources and digital learning.",
    iconBg: "bg-indigo-500",
    iconColor: "text-white",
  },
  {
    icon: BookOpen,
    title: "Study Areas",
    description:
      "Dedicated study areas and common spaces where students can collaborate, study, and engage in group activities.",
    iconBg: "bg-teal-500",
    iconColor: "text-white",
  },
];

export function CampusFacilities() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Campus Facilities"
          description="Modern facilities designed to support learning, growth, and student well-being"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <motion.div
                key={facility.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className={`${facility.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 ${facility.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3 text-center">
                      {facility.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {facility.description}
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

