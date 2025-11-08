/**
 * Upcoming Events Component
 * Displays upcoming school events and activities
 */

"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Calendar,
  Clock,
  GraduationCap,
  Handshake,
  MapPin,
  Palette,
  Trophy,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";
import { upcomingEvents as defaultEvents } from "@/lib/data/news";

interface UpcomingEventsProps {
  events?: typeof defaultEvents;
}

const eventIcons = [
  Users,
  Handshake,
  Palette,
  GraduationCap,
  Trophy,
  BriefcaseBusiness,
];

export function UpcomingEvents({ events = defaultEvents }: UpcomingEventsProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-[#020b26] via-[#031132] to-[#020922]">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Upcoming Events"
          description={
            <div className="space-y-3 text-white/80 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
              <p>
                Mark your calendar for these important school events and activities that strengthen the connections between our students, families, and wider community. Each date is carefully curated to celebrate achievement, showcase talent, and provide meaningful moments for everyone on campus.
              </p>
              <p>
                From vibrant cultural showcases to academic workshops and leadership forums, our event calendar ensures every learner has opportunities to grow, collaborate, and shine. Join us in championing the experiences that make Daddy Jobe Comprehensive School a truly dynamic place to learn and belong.
              </p>
            </div>
          }
          titleClassName="text-white drop-shadow-lg"
          descriptionClassName="text-white/80 drop-shadow-md max-w-3xl mx-auto"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ ...transitions.default, delay: index * 0.1 }}
            >
              <Card className="h-full bg-[#020b26]/85 border-none shadow-[0_15px_40px_rgba(2,11,38,0.35)] hover:shadow-[0_25px_50px_rgba(32,90,180,0.35)] transition-all duration-300 hover:-translate-y-2 rounded-3xl">
                <CardContent className="p-6 sm:p-7 md:p-8 h-full">
                  <div className="flex items-start gap-5">
                    <div className="p-4 rounded-2xl bg-white/10 text-gold flex-shrink-0 backdrop-blur-lg shadow-inner shadow-blue-900/50">
                      {(() => {
                        const Icon = eventIcons[index % eventIcons.length];
                        return <Icon className="h-8 w-8 text-white" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {event.date}
                        </span>
                        {event.time && (
                          <>
                            <span className="text-white/40">•</span>
                            <div className="flex items-center gap-1 text-white/70 font-normal normal-case">
                              <Clock className="h-3 w-3" />
                              <span>{event.time}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3 drop-shadow-lg">
                        {event.title}
                      </h3>
                      <p className="text-white/80 text-base leading-relaxed mb-4">
                        {event.description}
                      </p>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <MapPin className="h-4 w-4 text-gold" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

