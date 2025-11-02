/**
 * Important Dates Component
 * Key dates for the admission process
 */

"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const importantDates = [
  {
    event: "Application Period Opens",
    date: "February 1, 2025",
    description: "Start submitting your admission applications",
  },
  {
    event: "Application Deadline",
    date: "March 31, 2025",
    description: "Last day to submit completed applications",
  },
  {
    event: "Interviews & Assessments",
    date: "April 15 - 30, 2025",
    description: "Interview and assessment period for applicants",
  },
  {
    event: "Admission Results",
    date: "May 15, 2025",
    description: "Successful candidates will be notified",
  },
  {
    event: "Enrollment Period",
    date: "May 20 - June 15, 2025",
    description: "Complete enrollment and fee payment",
  },
  {
    event: "Orientation Day",
    date: "September 1, 2025",
    description: "Welcome orientation for new students",
  },
];

export function ImportantDates() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Important Dates"
          description="Key dates for the 2025-2026 academic year admission cycle"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {importantDates.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ ...transitions.default, delay: index * 0.1 }}
            >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-3 rounded-lg shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                        <Calendar className="h-6 w-6 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />
                      </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gold mb-1">
                        {item.date}
                      </div>
                      <h3 className="text-lg font-bold text-navy mb-2">
                        {item.event}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

