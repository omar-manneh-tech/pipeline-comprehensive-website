"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { fadeInLeft, fadeInRight, transitions, viewportConfig, hoverScale } from "@/lib/animations/constants";

export function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              About Daddy Jobe Comprehensive School
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Daddy Jobe Comprehensive School is one of The Gambia&apos;s leading senior secondary institutions, known for its unwavering commitment to academic excellence, discipline, and holistic student development.
              </p>
              <p>
                Since its establishment, the school has built a reputation for nurturing young minds through a balanced curriculum that emphasizes both intellectual growth and moral uprightness.
              </p>
              <p>
                Every year, students from across the country choose Daddy Jobe as their preferred path after completing Grade Nine. Our three-year senior secondary program (Grade 10 to Grade 12) prepares students for the West African Senior Secondary Certification Examination (WASSCE), opening pathways to higher education including the University of The Gambia and other institutions.
              </p>
              <p>
                Students can choose from three specialized programs: <strong>Science</strong>, <strong>Commerce</strong>, or <strong>Arts</strong>, each designed to align with their career aspirations and academic interests.
              </p>
            </div>
            <motion.div
              variants={hoverScale}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white border-2 border-gold hover:border-gold/80 mt-6"
              >
                <Link href="/about" className="flex items-center gap-2 font-semibold">
                  Learn More About Our Journey
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image - Right */}
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
            {/* Overlay Caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: 0.3 }}
                className="text-white"
              >
                <span className="text-2xl md:text-3xl font-bold tracking-wide">
                  Founded in Excellence
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
