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
    <section className="py-20 bg-gradient-to-br from-[#0b1c3f] via-[#102752] to-[#0b1c3f]">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Administrative Team"
          description={
            <div className="space-y-3 text-white/80 max-w-3xl mx-auto leading-relaxed">
              <p>
                Leadership and support staff ensuring smooth school operations. Our administrative professionals are the guardians of the school’s daily rhythm, keeping every department aligned and every initiative supported.
              </p>
              <p>
                From coordinating admissions and safeguarding our campus to managing communications and championing student services, they work tirelessly behind the scenes so teaching and learning remain seamless.
              </p>
              <p>
                Their attention to detail, dedication to service, and unwavering commitment to student success create a welcoming environment where families, staff, and learners feel confident and cared for every day.
              </p>
            </div>
          }
          titleClassName="text-white drop-shadow-lg"
          descriptionClassName="text-white/80"
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
              <Card className="h-full bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-300 shadow-[0_18px_45px_rgba(2,12,35,0.35)] hover:shadow-[0_28px_65px_rgba(255,255,255,0.25)]">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-white/15 border border-white/40 p-3 rounded-lg shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                      <ShieldCheck className="h-8 w-8 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />
                    </div>
                  </div>
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white/60 shadow-[0_12px_35px_rgba(15,23,42,0.45)]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                      quality={90}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white drop-shadow">
                    {member.name}
                  </h3>
                  <p className="text-gold font-semibold text-sm">
                    {member.position}
                  </p>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center justify-center gap-2 text-sm text-white/80 hover:text-gold transition-colors"
                    >
                      <Mail className="h-4 w-4 text-gold" />
                      Email
                    </a>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center justify-center gap-2 text-sm text-white/80 hover:text-gold transition-colors"
                      >
                        <Phone className="h-4 w-4 text-gold" />
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

