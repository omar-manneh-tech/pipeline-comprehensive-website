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
  },
  {
    icon: Bookmark,
    title: "Book Reservation",
    description: "Reserve books online and get notified when they're available",
  },
  {
    icon: Clock,
    title: "Track Due Dates",
    description: "Keep track of your borrowed books and return dates",
  },
  {
    icon: BookOpen,
    title: "E-Resources Access",
    description: "Access e-books, research databases, and multimedia materials",
  },
];

export function DigitalLibrary() {
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary" />
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

