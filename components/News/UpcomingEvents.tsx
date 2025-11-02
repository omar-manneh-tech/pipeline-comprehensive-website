/**
 * Upcoming Events Component
 * Displays upcoming school events and activities
 */

"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";
import { upcomingEvents as defaultEvents } from "@/lib/data/news";

interface UpcomingEventsProps {
  events?: typeof defaultEvents;
}

export function UpcomingEvents({ events = defaultEvents }: UpcomingEventsProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Upcoming Events"
          description="Mark your calendar for these important school events and activities"
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
              <Card className="h-full border-2 border-gold hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg flex-shrink-0">
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gold">
                          {event.date}
                        </span>
                        {event.time && (
                          <>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>{event.time}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-navy mb-3">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {event.description}
                      </p>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
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

