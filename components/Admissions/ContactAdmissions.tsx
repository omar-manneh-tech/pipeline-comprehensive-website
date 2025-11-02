/**
 * Contact Admissions Component
 * Contact information for admissions inquiries
 */

"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { siteConfig } from "@/config/site";
import { fadeInUp, transitions, viewportConfig } from "@/lib/animations/constants";

export function ContactAdmissions() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Contact Admissions Office"
          description="Have questions? We're here to help with your admission inquiries"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
          >
            <Card className="h-full border-2 border-gold">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-navy mb-6">
                  Get In Touch
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600 text-sm">{siteConfig.links.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <a
                        href={`tel:${siteConfig.links.phone}`}
                        className="text-gray-600 text-sm hover:text-primary"
                      >
                        {siteConfig.links.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a
                        href={`mailto:${siteConfig.links.email}`}
                        className="text-gray-600 text-sm hover:text-primary"
                      >
                        {siteConfig.links.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Office Hours</p>
                      <p className="text-gray-600 text-sm">
                        Monday - Friday: 8:00 AM - 4:00 PM
                        <br />
                        Saturday: 9:00 AM - 1:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ ...transitions.default, delay: 0.1 }}
          >
            <Card className="h-full border-2 border-gold">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-navy mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white border-2 border-gold"
                  >
                    <a href={`mailto:${siteConfig.links.email}?subject=Admission Inquiry`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email Inquiry
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-gold text-primary hover:bg-primary hover:text-white"
                  >
                    <a href={`tel:${siteConfig.links.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Admissions Office
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-gold text-primary hover:bg-primary hover:text-white"
                  >
                    <a href="/contact">
                      Visit Contact Page
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

