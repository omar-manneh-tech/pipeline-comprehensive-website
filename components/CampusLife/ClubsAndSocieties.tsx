/**
 * Clubs and Societies Component
 * Showcasing various clubs and societies available on campus
 */

"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Music,
  Paintbrush,
  Users,
  Microscope,
  Globe,
  Lightbulb,
  Code,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

interface Club {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const clubs: Club[] = [
  {
    icon: BookOpen,
    title: "Literary Society",
    description:
      "Engage in creative writing, poetry, debates, and book discussions to develop communication skills and critical thinking.",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    icon: Music,
    title: "Music & Drama Club",
    description:
      "Express creativity through music, theater, and performance arts. Participate in school concerts and drama productions.",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    icon: Paintbrush,
    title: "Arts & Culture Club",
    description:
      "Celebrate diversity through art, cultural exhibitions, and traditional performances that showcase our rich heritage.",
    iconBg: "bg-pink-500",
    iconColor: "text-white",
  },
  {
    icon: Users,
    title: "Student Council",
    description:
      "Develop leadership skills by representing student interests, organizing events, and contributing to school governance.",
    iconBg: "bg-green-500",
    iconColor: "text-white",
  },
  {
    icon: Microscope,
    title: "Science Club",
    description:
      "Explore scientific concepts through experiments, research projects, and participation in science fairs and competitions.",
    iconBg: "bg-yellow-500",
    iconColor: "text-white",
  },
  {
    icon: Globe,
    title: "Environmental Club",
    description:
      "Promote environmental awareness through sustainability projects, tree planting, and community clean-up initiatives.",
    iconBg: "bg-teal-500",
    iconColor: "text-white",
  },
  {
    icon: Lightbulb,
    title: "Innovation Hub",
    description:
      "Foster innovation and entrepreneurship through tech projects, startup ideas, and problem-solving challenges.",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    icon: Code,
    title: "Computer Club",
    description:
      "Learn programming, web development, and digital skills through hands-on projects and coding competitions.",
    iconBg: "bg-indigo-500",
    iconColor: "text-white",
  },
];

export function ClubsAndSocieties() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Clubs & Societies"
          description={
            <div className="space-y-4 text-gray-700 max-w-3xl mx-auto leading-relaxed">
              <p>
                Join a community of like-minded students and explore your passions through our diverse range of clubs that nurture creativity, confidence, and lifelong friendships.
              </p>
              <p>
                Whether you are drawn to music, science, leadership, or service, each society offers guided experiences, mentorship, and opportunities to showcase your talents on campus and beyond.
              </p>
              <p>
                Students collaborate on meaningful projects, compete in national events, and develop the skills that define a well-rounded Daddy Jobe scholar ready to make an impact.
              </p>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {clubs.map((club, index) => {
            const Icon = club.icon;
            return (
              <motion.div
                key={club.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-none bg-white hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full border-2 border-navy/80 bg-transparent shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                        <Icon className="h-8 w-8 text-navy transition-transform duration-500 group-hover:rotate-[360deg]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3 text-center">
                      {club.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {club.description}
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

