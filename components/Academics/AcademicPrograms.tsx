/**
 * Academic Programs Component
 * Display Science, Commerce, and Arts programs
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, Calculator, Palette, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";
import { academicPrograms } from "@/lib/data/academics";

export function AcademicPrograms() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Our Academic Programs"
          description="Three specialized tracks preparing students for WASSCE and beyond"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {academicPrograms.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ ...transitions.default, delay: index * 0.15 }}
              className="group"
            >
              <Card className="h-full border-2 border-gold hover:shadow-xl transition-all overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className={`${program.iconBg} w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-3 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                      <program.icon className={`h-8 w-8 ${program.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {program.name}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {program.description}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Core Subjects:</h4>
                      <ul className="space-y-2">
                        {program.coreSubjects.map((subject, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{subject}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {program.electiveSubjects && program.electiveSubjects.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-navy mb-2">Elective Subjects:</h4>
                        <ul className="space-y-2">
                          {program.electiveSubjects.map((subject, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-700">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-sm">{subject}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {program.careerPaths}
                      </p>
                    </div>
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

