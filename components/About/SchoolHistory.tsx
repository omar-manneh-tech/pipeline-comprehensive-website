/**
 * School History Component
 * Overview of the school's history and establishment
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

export function SchoolHistory() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Our Story"
          description="A legacy of excellence in education"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
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
                Daddy Jobe Comprehensive School is one of The Gambia&apos;s leading senior secondary institutions, known for its unwavering commitment to academic excellence, discipline, and holistic student development.
              </p>
              <p>
                Since its establishment, the school has built a reputation for nurturing young minds through a balanced curriculum that emphasizes both intellectual growth and moral uprightness.
              </p>
              <p>
                Our institution was founded with a vision to provide quality education that prepares students not just for academic success, but for life. We believe in creating an environment where students can discover their potential, develop critical thinking skills, and build character.
              </p>
              <p className="font-medium text-navy">
                Today, Daddy Jobe Comprehensive School stands as a beacon of educational excellence, producing graduates who excel in higher education and contribute meaningfully to society.
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
              src="/images/about/school_building.jpg"
              alt="Daddy Jobe Comprehensive School - Founded in Excellence"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

