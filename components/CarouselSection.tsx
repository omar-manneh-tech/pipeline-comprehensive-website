"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCarousel } from "@/hooks/useCarousel";
import { schoolEvents, type Event } from "@/lib/data/home";
import { SectionHeader } from "@/components/Shared/SectionHeader";

interface CarouselSectionProps {
  events?: Event[];
}

export function CarouselSection({ events = schoolEvents }: CarouselSectionProps) {
  const { currentIndex, goToSlide, goToPrevious, goToNext } = useCarousel({
    items: events,
    autoPlay: true,
    interval: 5000,
  });

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="School Events & Achievements"
          description="Stay updated with our latest events and accomplishments"
          titleClassName="text-gray-900"
          descriptionClassName="text-gray-600"
        />

        <div className="relative max-w-5xl mx-auto">
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-2xl">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: index === currentIndex ? 1 : 0,
                  scale: index === currentIndex ? 1 : 1.1,
                }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 ${index === currentIndex ? "z-10" : "z-0"}`}
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                  <h3 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg">
                    {event.title}
                  </h3>
                  <p className="text-lg md:text-xl text-white/95 max-w-2xl drop-shadow-md">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

