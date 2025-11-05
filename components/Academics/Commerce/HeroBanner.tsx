/**
 * Commerce Program Hero Banner
 * Hero section for the commerce program page
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-navy/75 via-primary/65 to-navy/60 z-10" />
        <Image
          src="/images/academics/commerce_class.png"
          alt="Commerce Program - Excellence in Business Education"
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
            Commerce Program
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-6 max-w-2xl mx-auto font-light drop-shadow-md">
            Building Future Business Leaders, Accountants, and Entrepreneurs
          </p>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
            A comprehensive curriculum designed to excel in WASSCE and prepare for university-level business programs
          </p>
        </motion.div>
      </div>
    </section>
  );
}

