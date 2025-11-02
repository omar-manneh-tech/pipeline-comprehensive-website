"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Parent",
    image: "/images/misc/placeholder_profile.jpg",
    text: "Daddy Jobe Comprehensive School has provided an exceptional learning environment for my child. The teachers are dedicated, and the curriculum is comprehensive.",
  },
  {
    name: "Michael Chen",
    role: "Alumni",
    image: "/images/misc/placeholder_profile.jpg",
    text: "The foundation I received here prepared me for success in university and beyond. I'm grateful for the excellent education and support.",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Parent & Educator",
    image: "/images/misc/placeholder_profile.jpg",
    text: "As an educator myself, I can see the quality of instruction and care at Daddy Jobe. It's a place where students truly thrive.",
  },
  {
    name: "David Thompson",
    role: "Student",
    image: "/images/misc/placeholder_profile.jpg",
    text: "I love coming to school every day! The teachers make learning fun, and I've made so many friends. This school is amazing!",
  },
  {
    name: "Amina Diallo",
    role: "Parent",
    image: "/images/misc/placeholder_profile.jpg",
    text: "The supportive community and excellent academic programs make this the best choice for our children's education.",
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-navy to-primary text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What People Say About Us
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Hear from students, parents, and educators about their experience at Daddy Jobe
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
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
                      <p className="text-lg md:text-xl text-white/95 mb-6 italic">
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
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-gold w-8"
                    : "bg-white/30 hover:bg-white/50"
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

