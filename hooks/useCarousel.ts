/**
 * useCarousel Hook
 * Reusable hook for carousel functionality
 */

import { useState, useEffect, useCallback } from "react";

interface UseCarouselOptions {
  items: unknown[];
  autoPlay?: boolean;
  interval?: number;
}

export function useCarousel({ items, autoPlay = true, interval = 5000 }: UseCarouselOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
    }
  }, [items.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!autoPlay || items.length === 0) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length, goToNext]);

  return {
    currentIndex,
    goToSlide,
    goToPrevious,
    goToNext,
  };
}

