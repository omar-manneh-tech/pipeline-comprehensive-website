/**
 * Portal Overview Component
 * Introduction to the school portal
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, Lock, Globe, Users } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const overviewFeatures = [
  {
    icon: Shield,
    title: "Secure Access",
    description: "Encrypted and secure platform for all your academic data",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Lock,
    title: "Privacy Protected",
    description: "Your personal information is kept confidential and secure",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Globe,
    title: "24/7 Access",
    description: "Access your portal anytime, anywhere with internet connection",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
  {
    icon: Users,
    title: "Multi-User",
    description: "Separate access for students, parents, and staff members",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconColor: "text-white",
  },
];

export function PortalOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="About the School Portal"
          description="A comprehensive digital platform for managing academic information"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={transitions.default}
            className="space-y-6"
          >
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The Daddy Jobe Comprehensive School Portal is a secure online platform designed to provide students, parents, and staff with convenient access to academic information and school resources.
              </p>
              <p>
                Through the portal, users can view grades, attendance records, academic schedules, assignments, announcements, and other important school information in one convenient location.
              </p>
              <p className="font-medium text-navy">
                Our portal ensures that all stakeholders stay informed and engaged with their academic journey, making it easier to track progress and communicate with the school.
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
              src="/images/academics/science_lab.jpeg"
              alt="School Portal at Daddy Jobe"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {overviewFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="group"
              >
                <div className="border-2 border-gold rounded-lg p-6 text-center hover:shadow-lg transition-all h-full">
                  <div className="flex justify-center mb-4">
                    <div className={`${feature.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                      <Icon className={`h-8 w-8 ${feature.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

