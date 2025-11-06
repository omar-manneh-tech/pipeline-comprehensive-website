/**
 * Campus Life Hero Banner
 * Hero section for the campus life page
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="relative h-[50vh] min-h-[350px] sm:min-h-[400px] md:min-h-[450px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-primary/80 to-navy/70 z-10" />
        <Image
          src="/images/gallery/sports_day.jpg"
          alt="Campus Life at Daddy Jobe Comprehensive School"
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-lg">
            Campus Life
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 mb-3 sm:mb-4 max-w-2xl mx-auto font-light drop-shadow-md px-2">
            A Vibrant Community Where Learning Meets Life
          </p>
        </motion.div>
      </div>
    </section>
  );
}


