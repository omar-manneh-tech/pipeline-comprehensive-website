/**
 * Staff Hero Banner
 * Hero section for the staff page
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-primary/80 to-navy/70 z-10" />
        <Image
          src="/images/hero/staff_banner.jpg"
          alt="Our Staff - Dedicated Educators"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Our Staff
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-6 max-w-2xl mx-auto font-light drop-shadow-md">
            Dedicated Educators Committed to Excellence
          </p>
        </motion.div>
      </div>
    </section>
  );
}

