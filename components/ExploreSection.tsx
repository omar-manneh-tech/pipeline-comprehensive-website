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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our School
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover everything we have to offer
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <Card className="relative overflow-hidden h-full hover:shadow-2xl border-2 border-gold transition-all cursor-pointer">
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
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="group/button w-full bg-primary hover:bg-white text-white hover:text-primary border-2 border-gold hover:border-gold transition-colors"
                  >
                    <Link href={item.href} className="flex items-center justify-center gap-2">
                      Learn More
                      <ArrowRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

