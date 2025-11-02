/**
 * Contact Info Component
 * Display contact information in a grid layout
 */

"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { siteConfig } from "@/config/site";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const contactMethods = [
  {
    icon: MapPin,
    title: "Visit Us",
    content: siteConfig.links.address,
    action: "Get Directions",
    href: `https://maps.google.com/?q=${encodeURIComponent(siteConfig.links.address)}`,
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Phone,
    title: "Call Us",
    content: siteConfig.links.phone,
    action: "Call Now",
    href: `tel:${siteConfig.links.phone}`,
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Mail,
    title: "Email Us",
    content: siteConfig.links.email,
    action: "Send Email",
    href: `mailto:${siteConfig.links.email}`,
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Clock,
    title: "Office Hours",
    content: "Monday - Friday: 8:00 AM - 4:00 PM\nSaturday: 9:00 AM - 1:00 PM\nSunday: Closed",
    action: null,
    href: null,
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function ContactInfo() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Get In Touch"
          description="Multiple ways to reach us. Choose the method that works best for you."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`${method.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 ${method.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 whitespace-pre-line">
                      {method.content}
                    </p>
                    {method.action && method.href && (
                      <a
                        href={method.href}
                        target={method.href.startsWith("http") ? "_blank" : "_self"}
                        rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-block text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
                      >
                        {method.action} →
                      </a>
                    )}
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

