"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const exploreItems = [
  {
    title: "About Us",
    description: "Learn about our mission, vision, and rich history of educational excellence.",
    image: "/images/about/school_building.png",
    href: "/about",
  },
  {
    title: "Academics",
    description: "Explore our senior secondary programs: Science, Commerce, and Arts. Prepare for WASSCE exams and university admission.",
    image: "/images/academics/science_lab.png",
    href: "/academics",
  },
  {
    title: "Admissions",
    description: "Start your journey with us. Discover our admission process and requirements.",
    image: "/images/hero/admission.png",
    href: "/admissions",
  },
];

export function ExploreSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1B2B5C]/8 via-[#0000CD]/15 to-[#1B2B5C]/8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent drop-shadow-lg font-extrabold">
            Explore Our School
          </h2>
          <div className="max-w-4xl mx-auto space-y-4 text-white/95 drop-shadow-md">
            <p className="text-lg md:text-xl leading-relaxed">
              Discover everything we have to offer at Daddy Jobe Comprehensive School. Our campus is a vibrant learning community where excellence meets opportunity, and every corner tells a story of growth, achievement, and transformation.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              From our comprehensive academic programs that prepare students for WASSCE and university admission, to our rich history and mission that guide our educational philosophy, to our streamlined admissions process that welcomes new students — there's so much to explore. Each area of our school represents a commitment to providing the best possible education and support for every student.
            </p>
            <p className="text-base md:text-lg leading-relaxed font-medium">
              Take a journey through our school and discover how we're shaping the leaders of tomorrow, one student at a time.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
          {exploreItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="relative overflow-hidden h-full hover:shadow-2xl border-2 border-gold transition-all cursor-pointer bg-transparent">
                <div className="relative h-64">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <CardContent className="p-6 bg-navy/90 backdrop-blur-md border-t border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gold transition-colors drop-shadow-lg">
                    {item.title}
                  </h3>
                  <p className="text-white/90 mb-4 drop-shadow-md">
                    {item.description}
                  </p>
                  <div className="flex justify-center">
                    <Button
                      asChild
                      variant="outline"
                      className="group/button w-auto border-2 border-gold text-white hover:bg-white hover:text-primary hover:border-gold text-xs sm:text-sm md:text-base px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full backdrop-blur-md shadow-xl bg-white/10 transition-all duration-300"
                    >
                      <Link href={item.href} className="flex items-center justify-center gap-1.5 sm:gap-2 font-semibold">
                        Learn More
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover/button:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
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

