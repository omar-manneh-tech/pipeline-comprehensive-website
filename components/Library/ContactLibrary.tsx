/**
 * Contact Library Component
 * Contact information for library inquiries
 */

"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { siteConfig } from "@/config/site";
import { transitions, viewportConfig } from "@/lib/animations/constants";

export function ContactLibrary() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Library Information"
          description="Get in touch with our library staff for assistance"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={transitions.default}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 border-gold">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Location</p>
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
                </div>
                <div>
                  <div className="flex items-start gap-3 mb-6">
                    <Clock className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Operating Hours</p>
                      <div className="text-gray-600 text-sm space-y-1">
                        <p>Monday - Friday: 8:00 AM - 4:00 PM</p>
                        <p>Saturday: 9:00 AM - 1:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white border-2 border-gold"
                  >
                    <a href={`mailto:${siteConfig.links.email}?subject=Library Inquiry`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Library Staff
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

