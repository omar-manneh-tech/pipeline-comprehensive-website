/**
 * useCountUp Hook
 * Animates a number from 0 to target value on scroll into view
 */

"use client";

import { useState, useEffect, useRef } from "react";

interface UseCountUpProps {
  end: number;
  duration?: number;
  start?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function useCountUp({
  end,
  duration = 2000,
  start = 0,
  suffix = "",
  prefix = "",
  decimals = 0,
}: UseCountUpProps) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const startTime = Date.now();
            const difference = end - start;

            const animate = () => {
              const now = Date.now();
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Easing function (ease-out)
              const easeOut = 1 - Math.pow(1 - progress, 3);

              const current = Math.floor(start + difference * easeOut);
              setCount(current);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [end, duration, start, hasAnimated]);

  const formatNumber = (num: number): string => {
    const formatted = num.toFixed(decimals);
    // Add commas for thousands separator
    const parts = formatted.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const finalFormatted = parts.join(".");
    return `${prefix}${finalFormatted}${suffix}`;
  };

  return { count, formattedCount: formatNumber(count), ref };
}

