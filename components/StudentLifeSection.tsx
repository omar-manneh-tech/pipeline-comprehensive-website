"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { studentActivities, type Activity } from "@/lib/data/home";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { fadeInUp, hoverLift, transitions, viewportConfig } from "@/lib/animations/constants";

interface StudentLifeSectionProps {
  activities?: Activity[];
}

const studentLifeDescription = (
  <>
    <p>
      Education at Daddy Jobe extends far beyond the classroom walls.
    </p>
    <p>
      Our students thrive in a vibrant community filled with opportunities to lead, create, and serve. From lively sports competitions to thought-provoking debates, from science fairs to cultural celebrations — Daddy Jobe students learn the value of teamwork, integrity, and resilience.
    </p>
    <p>
      Through clubs and societies, they discover new passions. Through service projects, they learn empathy. And through every experience, they grow into confident, responsible young adults ready to shape the future.
    </p>
    <p className="font-medium text-gray-200">
      The school&apos;s inclusive environment ensures that every learner — regardless of background or interest — finds a place to belong, contribute, and excel.
    </p>
  </>
);

export function StudentLifeSection({ activities = studentActivities }: StudentLifeSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1B2B5C]/8 via-[#0000CD]/15 to-[#1B2B5C]/8">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Life at Daddy Jobe"
          titleClassName="bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent drop-shadow-lg font-extrabold"
          description={
            <div className="max-w-4xl mx-auto space-y-4 text-gray-200 leading-relaxed">
              {studentLifeDescription}
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
              <div className="relative h-[400px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={90}
                />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.70) 100%)'
                }}>
                  <div className="absolute inset-0 border-t border-white/20" style={{ top: '50%' }} />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-black/70" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
                    {activity.title}
                  </h3>
                  <p className="text-base md:text-lg text-white/95 drop-shadow-md leading-relaxed line-clamp-4">
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

