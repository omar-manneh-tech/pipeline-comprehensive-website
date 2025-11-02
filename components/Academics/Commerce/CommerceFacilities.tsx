/**
 * Commerce Facilities Component
 * Display commerce-specific facilities
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calculator, Book, Computer, Briefcase } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const facilities = [
  {
    icon: Calculator,
    title: "Accounting Lab",
    description: "Practical accounting workspace with calculators, accounting software, and resources for hands-on accounting practice.",
    image: "/images/academics/science_lab.jpg",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Computer,
    title: "Computer Lab",
    description: "Modern computer facilities with business software, spreadsheets, and online resources for commerce studies and research.",
    image: "/images/academics/science_lab.jpg",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Book,
    title: "Business Library",
    description: "Extensive collection of business textbooks, economics journals, financial publications, and reference materials.",
    image: "/images/about/school_building.jpg",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Briefcase,
    title: "Business Resource Center",
    description: "Dedicated space for business case studies, group projects, and entrepreneurial activities.",
    image: "/images/academics/science_lab.jpg",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function CommerceFacilities() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Commerce Facilities"
          description="Resources and facilities supporting commerce education"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <motion.div
                key={facility.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="group"
              >
                <div className="border-2 border-gold rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={facility.image}
                      alt={facility.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className={`${facility.iconBg} p-3 rounded-lg shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-6 w-6 ${facility.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-navy mb-2">
                      {facility.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {facility.description}
                    </p>
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

