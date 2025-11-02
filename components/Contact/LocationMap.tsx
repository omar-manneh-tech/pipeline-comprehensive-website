/**
 * Location Map Component
 * Displays school location information and map placeholder
 */

"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { siteConfig } from "@/config/site";
import { transitions, viewportConfig } from "@/lib/animations/constants";

export function LocationMap() {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.links.address)}`;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Find Us"
          description="Visit our campus and experience our facilities firsthand"
        />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Address Card */}
            <Card className="border-2 border-gold">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-lg shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-navy mb-4">
                      Campus Location
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {siteConfig.links.address}
                    </p>
                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <p>
                        <strong className="text-navy">Public Transport:</strong> Accessible by bus and taxi
                      </p>
                      <p>
                        <strong className="text-navy">Parking:</strong> Available on campus
                      </p>
                      <p>
                        <strong className="text-navy">Visitor Hours:</strong> Monday - Friday, 8:00 AM - 4:00 PM
                      </p>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-white border-2 border-gold"
                    >
                      <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions on Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <div className="relative h-[400px] rounded-lg overflow-hidden border-2 border-gold shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold mb-2">Interactive Map</p>
                  <p className="text-gray-500 text-sm mb-4">
                    {siteConfig.links.address}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Click &quot;Get Directions&quot; to view on Google Maps
                  </p>
                </div>
              </div>
              {/* Note: To embed Google Maps, you'll need to:
                  1. Get a Google Maps API key
                  2. Enable the Maps Embed API
                  3. Replace the div above with an iframe like:
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(siteConfig.links.address)}`}
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Daddy Jobe Comprehensive School Location"
                  />
              */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

