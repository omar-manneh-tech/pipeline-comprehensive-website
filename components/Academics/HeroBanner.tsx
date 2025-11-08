/**
 * Academics Hero Banner
 * Hero section for the academics page
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="relative h-[25vh] min-h-[180px] sm:min-h-[220px] md:min-h-[260px] flex items-center justify-center overflow-hidden banner-section">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-primary/75 to-navy/80 z-10 banner-overlay" />
        <Image
          src="/images/academics/science_lab.png"
          alt="Academics - Excellence in Education"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-2 sm:px-4"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-lg banner-text">
            Academics
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 mb-3 sm:mb-4 max-w-2xl mx-auto font-light drop-shadow-md px-2 banner-text">
            Preparing students for WASSCE exams and university admission through Science, Commerce, and Arts programs
          </p>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto drop-shadow-md px-2">
            Preparing students for WASSCE exams and university admission through Science, Commerce, and Arts programs
          </p>
        </motion.div>
      </div>
    </section>
  );
}


