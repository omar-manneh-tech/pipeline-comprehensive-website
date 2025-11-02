/**
 * Digital Library Component
 * Information about the digital library system
 */

"use client";

import { motion } from "framer-motion";
import { BookOpen, Search, Bookmark, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const digitalFeatures = [
  {
    icon: Search,
    title: "Online Catalog",
    description: "Browse thousands of books, journals, and resources from anywhere",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
    animationDirection: "top", // From top
  },
  {
    icon: Bookmark,
    title: "Book Reservation",
    description: "Reserve books online and get notified when they're available",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
    animationDirection: "left", // From left (middle card 1)
  },
  {
    icon: Clock,
    title: "Track Due Dates",
    description: "Keep track of your borrowed books and return dates",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
    animationDirection: "right", // From right (middle card 2)
  },
  {
    icon: BookOpen,
    title: "E-Resources Access",
    description: "Access e-books, research databases, and multimedia materials",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
    animationDirection: "bottom", // From bottom
  },
];

export function DigitalLibrary() {
  const getInitialAnimation = (direction: string) => {
    switch (direction) {
      case "top":
        return { opacity: 0, y: -100 };
      case "bottom":
        return { opacity: 0, y: 100 };
      case "left":
        return { opacity: 0, x: -100 };
      case "right":
        return { opacity: 0, x: 100 };
      default:
        return { opacity: 0, y: 30 };
    }
  };

  const getAnimate = (direction: string) => {
    switch (direction) {
      case "top":
      case "bottom":
        return { opacity: 1, y: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Digital Library System"
          description="Bringing the entire library experience to your fingertips"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {digitalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={getInitialAnimation(feature.animationDirection)}
                whileInView={getAnimate(feature.animationDirection)}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.15 }}
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`${feature.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 ${feature.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

