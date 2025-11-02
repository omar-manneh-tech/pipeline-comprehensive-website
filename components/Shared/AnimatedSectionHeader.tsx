"use client";

/**
 * AnimatedSectionHeader Component
 * Client component for animations
 * Separated from Server Component for better performance
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeInUp, transitions, viewportConfig } from "@/lib/animations/constants";

interface AnimatedSectionHeaderProps {
  title: string;
  description?: string | ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function AnimatedSectionHeader({
  title,
  description,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}: AnimatedSectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportConfig}
      transition={transitions.default}
      className={`text-center mb-12 ${className}`}
    >
      <h2
        className={`text-3xl md:text-4xl font-bold text-navy mb-4 ${titleClassName}`}
      >
        {title}
      </h2>
      {description && (
        <div className={descriptionClassName}>
          {typeof description === "string" ? (
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {description}
            </p>
          ) : (
            description
          )}
        </div>
      )}
    </motion.div>
  );
}

