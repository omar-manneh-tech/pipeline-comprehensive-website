/**
 * Leadership Component
 * Information about school leadership
 */

"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const leadershipInfo = [
  {
    icon: ShieldCheck,
    title: "Administrative Leadership",
    description:
      "Our administrative team is dedicated to ensuring smooth operations and creating an environment conducive to learning and growth.",
  },
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description:
      "Led by experienced educators, our academic programs are designed to challenge students while providing the support they need to succeed.",
  },
  {
    icon: Users,
    title: "Student Support",
    description:
      "Our guidance and counseling department works closely with students to help them navigate their academic journey and prepare for their future.",
  },
];

export function Leadership() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Leadership & Excellence"
          description="Dedicated professionals committed to student success"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {leadershipInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
              >
                <Card className="h-full border-none bg-transparent shadow-none transition-none group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full border-2 border-blue-400/70 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                        <Icon className="h-8 w-8 text-navy transition-transform duration-500 group-hover:rotate-[360deg]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ ...transitions.default, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <Card className="border-none bg-transparent shadow-none">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-navy mb-4">
                Join Our Community
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Daddy Jobe Comprehensive School welcomes students from diverse backgrounds who are committed to academic excellence. Our three-year senior secondary program (Grade 10 to Grade 12) prepares students for WASSCE examinations and university admission.
              </p>
              <p className="text-gray-700 leading-relaxed">
                With programs in <strong>Science</strong>, <strong>Commerce</strong>, and <strong>Arts</strong>, we provide pathways that align with each student&apos;s career aspirations and academic interests.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

