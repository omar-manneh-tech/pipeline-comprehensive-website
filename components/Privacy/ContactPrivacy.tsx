/**
 * Contact Privacy Section
 * Information about contacting for privacy-related inquiries
 */

"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { transitions, viewportConfig } from "@/lib/animations/constants";
import Link from "next/link";

export function ContactPrivacy() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={transitions.default}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 border-gold">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-navy mb-6 text-center">
                Questions About Your Privacy?
              </h2>
              <p className="text-gray-700 mb-6 text-center">
                If you have any questions about this privacy policy or wish to exercise your rights,
                please contact us using the information below.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-lg inline-block mb-3">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Email</h3>
                  <a
                    href={`mailto:${siteConfig.links.email}`}
                    className="text-primary hover:underline"
                  >
                    {siteConfig.links.email}
                  </a>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-lg inline-block mb-3">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Phone</h3>
                  <a
                    href={`tel:${siteConfig.links.phone}`}
                    className="text-primary hover:underline"
                  >
                    {siteConfig.links.phone}
                  </a>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-lg inline-block mb-3">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Address</h3>
                  <p className="text-gray-700 text-sm">{siteConfig.links.address}</p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90 text-white border-2 border-gold">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

