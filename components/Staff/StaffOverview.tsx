/**
 * Staff Overview Component
 * Introduction to the staff and faculty
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

export function StaffOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Our Team"
          description="Passionate educators dedicated to student success"
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
                At Daddy Jobe Comprehensive School, we are proud to have a team of highly qualified, dedicated, and experienced educators who are passionate about teaching and student development.
              </p>
              <p>
                Our faculty members are selected through a rigorous process, ensuring they possess not only academic qualifications but also the commitment and values that align with our school&apos;s mission.
              </p>
              <p>
                With over 150 qualified teachers across Science, Commerce, and Arts programs, our staff brings a wealth of knowledge and experience to the classroom.
              </p>
              <p className="font-medium text-navy">
                Our teachers are continuously engaged in professional development programs to stay updated with the latest teaching methodologies and curriculum standards, ensuring our students receive the best education possible.
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
              src="/images/about/students_in_class.jpg"
              alt="Daddy Jobe Comprehensive School - Dedicated Teachers"
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

