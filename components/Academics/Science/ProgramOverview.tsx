/**
 * Science Program Overview Component
 * Introduction to the science program
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FlaskConical, Microscope, Atom, GraduationCap } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const programHighlights = [
  {
    icon: FlaskConical,
    title: "Chemistry Excellence",
    description: "Hands-on laboratory experience in chemistry",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Microscope,
    title: "Biology Mastery",
    description: "Comprehensive study of living organisms",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Atom,
    title: "Physics Fundamentals",
    description: "Understanding the laws of nature",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: GraduationCap,
    title: "University Ready",
    description: "Preparation for tertiary science programs",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function ProgramOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="About the Science Program"
          description="A rigorous science education preparing students for excellence"
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
                Our Science Program is designed for students who are passionate about understanding the natural world and aspire to pursue careers in Medicine, Engineering, Pharmacy, Computer Science, and other science-related fields.
              </p>
              <p>
                The program provides a solid foundation in the core sciences: Physics, Chemistry, and Biology, along with advanced Mathematics, ensuring students are well-prepared for the WASSCE examination and university-level studies.
              </p>
              <p className="font-medium text-navy">
                With state-of-the-art laboratory facilities, experienced science teachers, and a curriculum aligned with the WASSCE syllabus, our Science Program equips students with both theoretical knowledge and practical skills essential for success in science-related careers.
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
              src="/images/academics/science_lab.jpg"
              alt="Science Program at Daddy Jobe"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {programHighlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="group"
              >
                <div className="border-2 border-gold rounded-lg p-6 text-center hover:shadow-lg transition-all h-full">
                  <div className="flex justify-center mb-4">
                    <div className={`${highlight.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                      <Icon className={`h-8 w-8 ${highlight.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {highlight.description}
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

