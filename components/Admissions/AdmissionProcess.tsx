/**
 * Admission Process Component
 * Overview of the admission process steps
 */

"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, GraduationCap, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const processSteps = [
  {
    step: 1,
    icon: FileText,
    title: "Submit Application",
    description: "Complete and submit your admission application form along with required documents.",
  },
  {
    step: 2,
    icon: Calendar,
    title: "Attend Interview",
    description: "Participate in an interview and assessment to evaluate your readiness for our program.",
  },
  {
    step: 3,
    icon: GraduationCap,
    title: "Receive Admission",
    description: "Successful candidates will receive an admission letter with enrollment instructions.",
  },
  {
    step: 4,
    icon: CheckCircle,
    title: "Complete Enrollment",
    description: "Complete the enrollment process, pay fees, and prepare for your first day of classes.",
  },
];

export function AdmissionProcess() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Admission Process"
          description="Follow these simple steps to join Daddy Jobe Comprehensive School"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl" />
                        <div className="relative bg-primary/10 p-4 rounded-full">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-gold">Step {step.step}</span>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
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

