/**
 * Faculty Members Component
 * Display faculty members in cards
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";
import { facultyMembers } from "@/lib/data/staff";

export function FacultyMembers() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0b1c3f] via-[#0e234f] to-[#0b1c3f]">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Our Faculty"
          description={
            <div className="space-y-3 text-white/80 max-w-3xl mx-auto leading-relaxed">
              <p>
                Meet our dedicated teachers across all programs. Each educator at Daddy Jobe brings a wealth of expertise, compassion, and creative energy to every lesson they deliver.
              </p>
              <p>
                From STEM innovators mentoring future scientists to humanities scholars inspiring critical thinkers, our faculty tailor learning experiences that connect classroom knowledge with real-world relevance.
              </p>
              <p>
                Beyond academics, they mentor student leaders, guide personal growth, and champion every learner’s dreams—ensuring a holistic education that empowers success.
              </p>
            </div>
          }
          titleClassName="text-white drop-shadow-lg"
          descriptionClassName="text-white/80"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {facultyMembers.map((member, index) => (
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
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/60 shadow-[0_12px_35px_rgba(15,23,42,0.45)]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      quality={90}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white drop-shadow">
                    {member.name}
                  </h3>
                  <p className="text-gold font-semibold">
                    {member.position}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <GraduationCap className="h-4 w-4 text-white/80" />
                    <span className="text-sm text-white/75">{member.subject}</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-white/80">
                    <Mail className="h-4 w-4 text-gold" />
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-white hover:text-gold transition-colors"
                    >
                      Contact
                    </a>
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

