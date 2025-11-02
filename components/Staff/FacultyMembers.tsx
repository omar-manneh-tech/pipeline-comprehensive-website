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
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Our Faculty"
          description="Meet our dedicated teachers across all programs"
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
              <Card className="h-full border-2 border-gold hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gold shadow-lg">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      quality={90}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gold font-semibold mb-2">
                    {member.position}
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <GraduationCap className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{member.subject}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
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

