"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCarousel } from "@/hooks/useCarousel";
import { testimonials as defaultTestimonials, type Testimonial } from "@/lib/data/home";
import { SectionHeader } from "@/components/Shared/SectionHeader";

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
}

export function TestimonialCarousel({ testimonials = defaultTestimonials }: TestimonialCarouselProps) {
  const { currentIndex, goToSlide } = useCarousel({
    items: testimonials,
    autoPlay: true,
    interval: 6000,
  });

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 text-gray-900 mb-0">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionHeader
          title="What People Say About Us"
          description="Hear from students, parents, and educators about their experience at Daddy Jobe"
        />

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-primary shadow-xl border-2 border-gold">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gold flex-shrink-0">
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <Quote className="h-8 w-8 text-gold mb-4 mx-auto md:mx-0" />
                      <p className="text-lg md:text-xl text-white mb-6 italic">
                        &ldquo;{testimonials[currentIndex].text}&rdquo;
                      </p>
                      <div>
                        <p className="font-semibold text-lg text-white">
                          {testimonials[currentIndex].name}
                        </p>
                        <p className="text-white/80 text-sm">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-gold w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

