/**
 * Career Paths Component
 * Display career opportunities for commerce students
 */

"use client";

import { motion } from "framer-motion";
import { Calculator, Building2, PiggyBank, TrendingUp, ShoppingBag, Briefcase } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const careerPaths = [
  {
    icon: Calculator,
    title: "Accounting",
    description: "Become a certified accountant, auditor, or financial analyst. Work in public accounting firms, corporations, or government agencies.",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Building2,
    title: "Banking & Finance",
    description: "Pursue careers in banking, investment management, insurance, or financial services. Work with financial institutions and investment companies.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: TrendingUp,
    title: "Business Administration",
    description: "Management positions in corporations, startups, or non-profit organizations. Lead teams, manage operations, and drive business growth.",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: ShoppingBag,
    title: "Marketing & Sales",
    description: "Marketing management, advertising, brand management, or sales roles. Help businesses connect with customers and grow market share.",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
  {
    icon: Briefcase,
    title: "Entrepreneurship",
    description: "Start and manage your own business. Apply business knowledge to create innovative products or services and build successful enterprises.",
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    iconColor: "text-white",
  },
  {
    icon: PiggyBank,
    title: "Economics & Research",
    description: "Economic analyst, policy researcher, or consultant roles. Analyze economic trends and provide insights to businesses and governments.",
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
          description="Exciting career opportunities available to Commerce Program graduates"
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

