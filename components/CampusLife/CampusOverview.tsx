/**
 * Campus Overview Component
 * Overview section for campus life page
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Heart, Sparkles, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const campusHighlights = [
  {
    icon: Users,
    title: "Inclusive Community",
    description:
      "A welcoming environment where every student belongs, contributes, and thrives regardless of background or interest.",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    icon: Heart,
    title: "Holistic Development",
    description:
      "Beyond academics, we nurture character, leadership, empathy, and resilience through diverse experiences and opportunities.",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    icon: Sparkles,
    title: "Diverse Activities",
    description:
      "From sports and arts to clubs and service projects, students discover passions and develop new skills every day.",
    iconBg: "bg-yellow-500",
    iconColor: "text-white",
  },
  {
    icon: Award,
    title: "Excellence in All",
    description:
      "We celebrate achievements in academics, sports, arts, and leadership, recognizing every student's unique contributions.",
    iconBg: "bg-gold",
    iconColor: "text-white",
  },
];

export function CampusOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/gallery/cultural_day.jpg"
              alt="Campus Life at Daddy Jobe Comprehensive School"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
              Experience Campus Life at Daddy Jobe
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Education at Daddy Jobe extends far beyond the classroom walls. Our students thrive in a vibrant community filled with opportunities to lead, create, and serve.
              </p>
              <p>
                From lively sports competitions to thought-provoking debates, from science fairs to cultural celebrations — Daddy Jobe students learn the value of teamwork, integrity, and resilience.
              </p>
              <p>
                Through clubs and societies, they discover new passions. Through service projects, they learn empathy. And through every experience, they grow into confident, responsible young adults ready to shape the future.
              </p>
              <p className="font-medium text-navy">
                The school's inclusive environment ensures that every learner — regardless of background or interest — finds a place to belong, contribute, and excel.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Highlights */}
        <SectionHeader
          title="What Makes Campus Life Special"
          description="Discover the pillars that shape our vibrant campus community"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {campusHighlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`${highlight.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 ${highlight.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {highlight.description}
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

