/**
 * Academic Facilities Component
 * Display school facilities and resources
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Microscope, Book, Computer, Calculator, FlaskConical, Globe } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const facilities = [
  {
    icon: Microscope,
    title: "Science Laboratory",
    description: "Fully equipped laboratory for physics, chemistry, and biology experiments",
    image: "/images/academics/science_lab.png",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Computer,
    title: "Computer Lab",
    description: "Modern computer facilities with internet access for ICT and research",
    image: "/images/academics/ict_lab.jpeg",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Book,
    title: "Library",
    description: "Well-stocked library with textbooks, reference materials, and study spaces",
    image: "/images/about/school_building.png",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Calculator,
    title: "Mathematics Resources",
    description: "Comprehensive resources for mathematics and statistics learning",
    image: "/images/academics/science_lab.png",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function AcademicFacilities() {
  return (
    <section className="py-20 bg-navy/95">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Academic Facilities & Resources"
          description={
            <p className="text-lg text-white/85 max-w-3xl mx-auto drop-shadow-md">
              State-of-the-art environments where curiosity meets innovation. Each space is intentionally designed to enhance discovery, collaboration, and hands-on mastery across every discipline.
            </p>
          }
          titleClassName="text-white"
          descriptionClassName=""
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
                <article className="relative h-full overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/20 border border-white/15">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={facility.image}
                      alt={facility.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="p-3 rounded-full border-2 border-blue-300/70 bg-black/30 backdrop-blur-md transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                        <Icon className="h-6 w-6 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-2xl font-semibold text-white drop-shadow-lg">
                      {facility.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {facility.description}
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-white/10 text-white/70 text-sm">
                      <Globe className="h-4 w-4" />
                      <span>Accessible daily with supervised support and guided sessions.</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" />
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

