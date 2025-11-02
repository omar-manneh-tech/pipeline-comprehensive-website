"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { studentActivities, type Activity } from "@/lib/data/home";
import { SectionHeader } from "@/components/Shared/SectionHeader";

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
    <p className="font-medium text-navy">
      The school&apos;s inclusive environment ensures that every learner — regardless of background or interest — finds a place to belong, contribute, and excel.
    </p>
  </>
);

export function StudentLifeSection({ activities = studentActivities }: StudentLifeSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Life at Daddy Jobe"
          description={
            <div className="max-w-4xl mx-auto space-y-4 text-gray-700 leading-relaxed">
              {studentLifeDescription}
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
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

