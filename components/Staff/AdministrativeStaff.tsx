/**
 * Administrative Staff Component
 * Display administrative staff members
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";
import { administrativeStaff } from "@/lib/data/staff";

export function AdministrativeStaff() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Administrative Team"
          description="Leadership and support staff ensuring smooth school operations"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {administrativeStaff.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ ...transitions.default, delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full border-2 border-gold hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-3 rounded-lg shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                      <ShieldCheck className="h-8 w-8 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />
                    </div>
                  </div>
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gold shadow-lg">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                      quality={90}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gold font-semibold text-sm mb-3">
                    {member.position}
                  </p>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {member.phone}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

