/**
 * Requirements Component
 * Admission requirements for Grade 10 enrollment
 */

"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const requirements = [
  "Completion of Grade 9 (Junior Secondary School)",
  "Minimum age of 15 years",
  "Grade 9 completion certificate or equivalent",
  "Two recent passport-sized photographs",
  "Copy of birth certificate",
  "Medical certificate (health clearance)",
  "Previous school records/transcripts",
  "Recommendation letter from previous school",
];

const documents = [
  "Completed admission application form",
  "Photocopy of Grade 9 certificate",
  "Copy of birth certificate",
  "Medical clearance certificate",
  "Passport-sized photographs (2 copies)",
  "Previous school academic records",
  "Recommendation letter",
  "Parent/Guardian identification",
];

export function Requirements() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Admission Requirements"
          description="What you need to enroll in Grade 10 at Daddy Jobe Comprehensive School"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
          >
            <Card className="h-full border-2 border-gold">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-navy mb-6">Eligibility Criteria</h3>
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={viewportConfig}
                      transition={{ ...transitions.default, delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{req}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
          >
            <Card className="h-full border-2 border-gold">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-navy mb-6">Required Documents</h3>
                <ul className="space-y-3">
                  {documents.map((doc, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={viewportConfig}
                      transition={{ ...transitions.default, delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{doc}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

