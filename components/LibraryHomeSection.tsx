/**
 * Library Home Section Component
 * Displays library information on the home page
 * Image left, text right layout with checkmarks and icons
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Library,
  Monitor,
  Search,
  Users,
  BookMarked,
  Database,
  Lightbulb,
  CheckCircle,
  LucideIcon,
} from "lucide-react";
import { transitions, viewportConfig } from "@/lib/animations/constants";

interface LibraryFeature {
  icon: LucideIcon;
  text: string;
  iconColor: string;
  iconBg: string;
}

const libraryFeatures: LibraryFeature[] = [
  {
    icon: Lightbulb,
    text: "Access to knowledge is the foundation of lifelong success",
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-50",
  },
  {
    icon: Library,
    text: "State-of-the-art library with extensive collection of textbooks, reference materials, novels, and academic journals",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    icon: Monitor,
    text: "Digital learning platform with online research databases, e-books, and multimedia resources",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
  },
  {
    icon: Search,
    text: "Search, reserve, or renew materials from any connected device — building independence and digital literacy",
    iconColor: "text-green-500",
    iconBg: "bg-green-50",
  },
  {
    icon: Users,
    text: "Dedicated librarians provide hands-on support in research techniques, information evaluation, and citation ethics",
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
  },
  {
    icon: BookMarked,
    text: "Quiet reading zones, collaborative study areas, and computer access for research and assignments",
    iconColor: "text-teal-500",
    iconBg: "bg-teal-50",
  },
  {
    icon: Database,
    text: "Digital Library System for book availability, borrowing records, and newly added titles",
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
  },
];

export function LibraryHomeSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Image - Left (Desktop) / Top (Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl order-1"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/library/library-interior.jpg"
                alt="Daddy Jobe Comprehensive School Library - Modern Learning Space with Books and Study Areas"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                priority
                unoptimized={true}
              />
            </div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Text Content - Right (Desktop) / Below (Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="space-y-6 order-2"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Empowering Learning Through Knowledge
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                At Daddy Jobe Comprehensive School, we believe that access to knowledge is the foundation of lifelong success. Our library serves as both a sanctuary for study and a hub for discovery.
              </p>

              {/* Features List with Icons and Checkmarks */}
              <ul className="space-y-3">
                {libraryFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={viewportConfig}
                      transition={{ ...transitions.default, delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      {/* Icon Container */}
                      <div className={`${feature.iconBg} p-2.5 rounded-lg flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                      </div>
                      
                      {/* Checkmark */}
                      <div className="bg-[#1B2B5C] rounded-full p-0.5 flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      
                      {/* Text */}
                      <span className="text-gray-700 leading-relaxed flex-1">
                        {feature.text}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div className="flex justify-center mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={transitions.default}
              >
                <Button
                  asChild
                  variant="outline"
                  className="group/button w-auto border-2 border-gold text-white hover:bg-white hover:text-primary hover:border-gold text-xs sm:text-sm md:text-base px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full backdrop-blur-md shadow-xl bg-primary transition-all duration-300"
                >
                  <Link href="/library" className="flex items-center justify-center gap-1.5 sm:gap-2 font-semibold">
                    <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover/button:translate-x-1 transition-transform" />
                    Explore Library
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

