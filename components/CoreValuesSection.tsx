"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Handshake, Trophy, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { coreValues, type CoreValue } from "@/lib/data/home";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { fadeInUp, hoverLift, transitions, viewportConfig } from "@/lib/animations/constants";

// Icon mapping
const iconMap: Record<CoreValue["iconName"], LucideIcon> = {
  ShieldCheck,
  Handshake,
  Trophy,
};

interface CoreValuesSectionProps {
  values?: CoreValue[];
}

const coreValuesDescription = (
  <>
    At Daddy Jobe Comprehensive School, we believe education goes beyond books and classrooms.
    <br />
    <span className="font-medium">
      Our students are guided by three timeless pillars that shape not only their academic journey, but their character and future.
    </span>
  </>
);

export function CoreValuesSection({ values = coreValues }: CoreValuesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Our Core Values"
          description={
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {coreValuesDescription}
            </p>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = iconMap[value.iconName];
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                variants={hoverLift}
              >
                    <Card className="h-full hover:shadow-2xl border-2 border-gold transition-all cursor-pointer bg-white group">
                      <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl" />
                            <div className={`relative ${
                              value.iconName === "ShieldCheck" 
                                ? "bg-gradient-to-br from-blue-500 to-blue-700" 
                                : value.iconName === "Handshake"
                                ? "bg-gradient-to-br from-green-500 to-green-700"
                                : "bg-gradient-to-br from-yellow-400 to-yellow-600"
                            } p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                              <Icon className="h-10 w-10 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />
                            </div>
                          </div>
                        </div>
                    <h3 className="text-2xl font-bold text-navy mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {value.description}
                    </p>
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

