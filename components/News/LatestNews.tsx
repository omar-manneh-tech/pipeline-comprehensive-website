/**
 * Latest News Component
 * Displays the most recent news articles and announcements
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";
import { latestNews as defaultNews } from "@/lib/data/news";

interface LatestNewsProps {
  news?: typeof defaultNews;
}

export function LatestNews({ news = defaultNews }: LatestNewsProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1B2B5C]/8 via-[#0000CD]/15 to-[#1B2B5C]/8">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Latest News"
          description={
            <div className="space-y-3 text-white/90 drop-shadow-md max-w-4xl mx-auto leading-relaxed">
              <p>
                Recent announcements and updates from Daddy Jobe Comprehensive School keep our parents, students, and community connected to the heartbeat of campus life. From academic milestones to community outreach, every headline reflects our commitment to excellence.
              </p>
              <p>
                Stay informed about groundbreaking classroom innovations, celebrations of student achievements, staff spotlights, and the events shaping our shared future. Each story captures the energy, ambition, and care that define the Daddy Jobe experience.
              </p>
              <p>
                Dive deeper into the stories that are moving our school forward and discover how our learners, educators, and partners continue to inspire progress every single day.
              </p>
            </div>
          }
          titleClassName="bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent drop-shadow-lg font-extrabold"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 max-w-7xl mx-auto">
          {news.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ ...transitions.default, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="relative overflow-hidden h-full hover:shadow-2xl border-2 border-gold transition-all bg-transparent">
                <div className="relative h-52">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/10 backdrop-blur-md border border-gold text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                      {article.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6 bg-navy/90 backdrop-blur-md border-t border-white/10 flex flex-col h-full space-y-5">
                  <div className="flex items-center gap-2 text-sm text-white/80 mb-3">
                    <Calendar className="h-4 w-4 text-gold" />
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gold transition-colors drop-shadow-lg">
                    {article.title}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base line-clamp-4 drop-shadow-md leading-relaxed">
                    {article.excerpt}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="group/button w-fit border-2 border-gold text-white hover:bg-white hover:text-primary hover:border-gold text-xs sm:text-sm md:text-base px-4 sm:px-5 md:px-6 py-2 rounded-full backdrop-blur-md shadow-xl bg-white/10 transition-all duration-300"
                  >
                    <Link href={`/news/${article.id}`} className="flex items-center gap-2 font-semibold">
                      Read More
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

