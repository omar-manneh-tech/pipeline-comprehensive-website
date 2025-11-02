"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Handshake, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const coreValues = [
  {
    title: "Discipline",
    icon: ShieldCheck,
    description:
      "Discipline is the foundation of success. We instill focus, respect, and a strong sense of responsibility — values that prepare students for life's challenges inside and outside the classroom.",
  },
  {
    title: "Integrity",
    icon: Handshake,
    description:
      "Integrity is our compass. Every student learns the importance of honesty, fairness, and doing what's right — even when no one is watching.",
  },
  {
    title: "Excellence",
    icon: Trophy,
    description:
      "Excellence drives everything we do. From academics to character development, we inspire our students to reach their full potential through dedication and a love for learning.",
  },
];

export function CoreValuesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            At Daddy Jobe Comprehensive School, we believe education goes beyond books and classrooms.
            <br />
            <span className="font-medium">
              Our students are guided by three timeless pillars that shape not only their academic journey, but their character and future.
            </span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full hover:shadow-2xl hover:border-gold/30 hover:border-2 transition-all cursor-pointer bg-white">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl" />
                        <div className="relative bg-primary/10 p-4 rounded-full">
                          <Icon className="h-10 w-10 text-primary" />
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

