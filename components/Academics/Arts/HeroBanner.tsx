/**
 * Arts Program Hero Banner
 * Hero section for the arts program page
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="relative h-[50vh] min-h-[350px] sm:min-h-[400px] md:min-h-[450px] flex items-center justify-center overflow-hidden banner-section">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-primary/75 to-navy/80 z-10 banner-overlay" />
        <Image
          src="/images/academics/arts_studio.png"
          alt="Arts Program - Excellence in Humanities Education"
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
            Arts Program
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 mb-2 sm:mb-3 max-w-2xl mx-auto font-light drop-shadow-md px-2">
            Nurturing Creative Minds and Future Leaders in Humanities
          </p>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto drop-shadow-md px-2 banner-text">
            A comprehensive curriculum designed to excel in WASSCE and prepare for university-level humanities programs
          </p>
        </motion.div>
      </div>
    </section>
  );
}


