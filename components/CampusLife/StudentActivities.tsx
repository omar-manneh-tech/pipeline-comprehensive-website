/**
 * Student Activities Component
 * Showcasing various student activities on campus
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { studentActivities, type Activity } from "@/lib/data/home";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig, hoverLift } from "@/lib/animations/constants";

interface StudentActivitiesProps {
  activities?: Activity[];
}

export function StudentActivities({ activities = studentActivities }: StudentActivitiesProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1B2B5C]/8 via-[#0000CD]/15 to-[#1B2B5C]/8">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Student Activities"
          description="Explore the diverse range of activities that enrich student life at Daddy Jobe"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ ...transitions.default, delay: index * 0.1 }}
              variants={hoverLift}
              className="group"
            >
              <div className="relative h-[300px] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 drop-shadow-lg">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-white/90 drop-shadow-md">
                    {activity.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

