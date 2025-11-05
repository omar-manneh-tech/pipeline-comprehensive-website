/**
 * Sports and Athletics Component
 * Showcasing sports programs and athletic facilities
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Target, Users2, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const sports = [
  {
    icon: Trophy,
    title: "Competitive Sports",
    description:
      "Participate in inter-school competitions including football, basketball, volleyball, athletics, and track events.",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    icon: Target,
    title: "Physical Fitness",
    description:
      "Regular physical education classes and fitness programs that promote health, wellness, and active lifestyles.",
    iconBg: "bg-green-500",
    iconColor: "text-white",
  },
  {
    icon: Users2,
    title: "Team Sports",
    description:
      "Build teamwork, leadership, and sportsmanship through football, basketball, volleyball, and other team activities.",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    icon: Award,
    title: "Athletic Excellence",
    description:
      "Recognize and celebrate athletic achievements through awards, trophies, and school sports day competitions.",
    iconBg: "bg-gold",
    iconColor: "text-white",
  },
];

export function SportsAndAthletics() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1B2B5C]/8 via-[#0000CD]/15 to-[#1B2B5C]/8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mb-16">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
              Sports & Athletics
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                At Daddy Jobe, we believe that physical activity is essential for holistic development. Our sports programs promote physical fitness, teamwork, discipline, and healthy competition.
              </p>
              <p>
                Students participate in various sports including football, basketball, volleyball, athletics, and track events. We have modern sports facilities including a football field, basketball court, and athletics track.
              </p>
              <p>
                Our annual sports day brings together students, teachers, and parents to celebrate athletic excellence, teamwork, and sportsmanship. It's a day of competition, camaraderie, and celebration.
              </p>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/gallery/sports_day.jpg"
              alt="Sports and Athletics at Daddy Jobe Comprehensive School"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Sports Features */}
        <SectionHeader
          title="Athletic Programs"
          description="Discover the sports programs that build champions on and off the field"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {sports.map((sport, index) => {
            const Icon = sport.icon;
            return (
              <motion.div
                key={sport.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`${sport.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 ${sport.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">
                      {sport.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {sport.description}
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

