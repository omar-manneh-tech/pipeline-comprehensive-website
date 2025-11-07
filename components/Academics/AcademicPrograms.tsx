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
    <section className="py-20 bg-navy/95">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Our Academic Programs"
          description={
            <p className="text-lg text-white/90 drop-shadow-md max-w-3xl mx-auto">
              Three specialized tracks preparing students for WASSCE and beyond
            </p>
          }
          titleClassName="text-white"
          descriptionClassName=""
        />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={transitions.default}
          className="max-w-4xl mx-auto mt-8 mb-12 text-white/85 text-lg leading-relaxed space-y-4 text-center"
        >
          <p>
            Our academic model blends rigorous classroom instruction with immersive, real-world learning opportunities. Whether students are exploring advanced sciences, building a strong foundation in commerce, or nurturing their creativity through the arts, each program is crafted to develop critical thinking, collaboration, and leadership skills.
          </p>
          <p className="text-white/80">
            Dedicated faculty mentors guide every learner through personalized academic plans, enrichment seminars, and exam-focused workshops. This holistic support ensures our graduates not only excel in the WASSCE, but also gain the confidence to thrive at university and contribute meaningfully to their communities.
          </p>
        </motion.div>

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
              <Card className="h-full border border-white/10 hover:shadow-[0_20px_45px_rgba(255,255,255,0.25)] transition-all overflow-hidden bg-transparent">
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
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110 border-2 border-white/80 bg-transparent">
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
                <CardContent className="p-6 bg-transparent">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Core Subjects:</h4>
                      <ul className="space-y-2">
                        {program.coreSubjects.map((subject, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-white/85">
                            <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />
                            <span className="text-sm">{subject}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {program.electiveSubjects && program.electiveSubjects.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Elective Subjects:</h4>
                        <ul className="space-y-2">
                          {program.electiveSubjects.map((subject, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-white/85">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-sm">{subject}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-white/80 leading-relaxed">
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

