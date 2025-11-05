"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCountUp } from "@/hooks/useCountUp";

interface Statistic {
  id: string;
  number: number;
  suffix?: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

// Fallback tiles (used if API fails)
const fallbackTiles = [
  {
    icon: "Users",
    number: 2500,
    suffix: "+",
    title: "Students",
    description: "Enrolled students across all programs",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
  },
  {
    icon: "GraduationCap",
    number: 150,
    suffix: "+",
    title: "Teachers",
    description: "Dedicated and experienced educators",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
  },
  {
    icon: "BookOpen",
    number: 10000,
    suffix: "+",
    title: "Library Books",
    description: "Extensive collection of resources",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-green-500 to-green-700",
  },
  {
    icon: "Award",
    number: 95,
    suffix: "%",
    title: "Pass Rate",
    description: "Outstanding academic achievements",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
  },
];

interface CountUpCardProps {
  tile: {
    icon: string;
    number: number;
    suffix?: string;
    title: string;
    description: string;
    color: string;
    bgColor: string;
  };
  index: number;
}

function CountUpCard({ tile, index }: CountUpCardProps) {
  // Get icon component dynamically
  const IconComponent = (LucideIcons as any)[tile.icon] || LucideIcons.Users;

  const { formattedCount, ref } = useCountUp({
    end: tile.number,
    suffix: tile.suffix,
    duration: 2000,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-gold group">
        <CardContent className="p-6 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 ${tile.bgColor} rounded-full shadow-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
            <IconComponent className={`h-8 w-8 ${tile.color} transition-transform duration-500 group-hover:rotate-[360deg]`} />
          </div>
          <motion.div
            ref={ref}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="text-4xl font-bold text-gray-900 mb-2"
          >
            {formattedCount}
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {tile.title}
          </h3>
          <p className="text-sm text-gray-600">
            {tile.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TileGrid() {
  const [tiles, setTiles] = useState<typeof fallbackTiles>(fallbackTiles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch statistics from CMS API
    const fetchStatistics = async () => {
      try {
        const response = await fetch("/api/site/statistics");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            // Transform CMS data to component format
            const transformed = data.data.map((stat: Statistic) => ({
              icon: stat.icon,
              number: stat.number,
              suffix: stat.suffix || "",
              title: stat.title,
              description: stat.description,
              color: stat.textColor || "text-white",
              bgColor: stat.bgColor || "bg-gradient-to-br from-blue-500 to-blue-700",
            }));
            setTiles(transformed);
          }
        }
      } catch (error) {
        console.error("[TileGrid] Failed to fetch statistics:", error);
        // Keep fallback tiles
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading && tiles.length === 0) {
    return null; // Don't render if loading and no fallback
  }

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
            At a Glance
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what makes Daddy Jobe Comprehensive School a leader in education
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiles.map((tile, index) => (
            <CountUpCard key={tile.title} tile={tile} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
