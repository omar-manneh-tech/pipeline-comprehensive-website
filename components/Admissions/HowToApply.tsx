/**
 * How To Apply Component
 * Step-by-step guide for applying
 */

"use client";

import { motion } from "framer-motion";
import { Download, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { siteConfig } from "@/config/site";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const applicationSteps = [
  {
    step: 1,
    title: "Download Application Form",
    description: "Download the admission application form from our website or collect it from the school office.",
    icon: Download,
  },
  {
    step: 2,
    title: "Complete the Form",
    description: "Fill out all required sections of the application form accurately and completely.",
    icon: Mail,
  },
  {
    step: 3,
    title: "Gather Documents",
    description: "Collect all required documents as listed in the admission requirements section.",
    icon: Download,
  },
  {
    step: 4,
    title: "Submit Application",
    description: "Submit your completed application form and documents to the school administration office.",
    icon: Mail,
  },
];

export function HowToApply() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="How To Apply"
          description="Follow these steps to submit your admission application"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {applicationSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gold">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-gold">Step {step.step}</span>
                        </div>
                        <h3 className="text-xl font-bold text-navy mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Application Form Download */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={transitions.default}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="border-2 border-gold">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-navy mb-4">
                Ready to Apply?
              </h3>
              <p className="text-gray-600 mb-6">
                Download the admission application form and submit it along with all required documents.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white border-2 border-gold"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Application Form
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

