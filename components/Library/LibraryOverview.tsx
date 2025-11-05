/**
 * Library Overview Component
 * Two-column layout: image left, content right (desktop)
 * Image top, content below (mobile)
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { transitions, viewportConfig } from "@/lib/animations/constants";

export function LibraryOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image - Left (Desktop) / Top (Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl order-1 md:order-1"
          >
            <Image
              src="/images/library/library-interior.webp"
              alt="Daddy Jobe Comprehensive School Library - Modern Learning Space"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>

          {/* Text Content - Right (Desktop) / Below (Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="space-y-6 order-2 md:order-2"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Empowering Learning Through Knowledge
              </h2>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The Daddy Jobe Comprehensive School Library stands as the heart of academic excellence — a space where curiosity meets discovery.
              </p>
              <p>
                Our modern library combines traditional reading culture with cutting-edge digital resources, giving students access to thousands of books, research journals, e-books, and multimedia materials that support every field of study.
              </p>
              <p>
                Guided by our dedicated library staff, students learn how to research, think critically, and develop a lifelong passion for knowledge. The space also serves as a quiet retreat for reflection, collaboration, and self-paced learning.
              </p>
              <p className="font-medium text-navy">
                Through our connected Digital Library System, students can now browse, reserve, and track books online — bringing the entire library experience to their fingertips.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white border-2 border-gold hover:border-gold/80 mt-6"
              >
                <Link href="/library" className="flex items-center gap-2 font-semibold">
                  <BookOpen className="h-5 w-5" />
                  Explore Library
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

