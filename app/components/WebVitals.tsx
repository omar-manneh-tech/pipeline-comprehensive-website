"use client";

/**
 * Web Vitals Tracking
 * Monitors Core Web Vitals for performance analysis
 */

import { useEffect } from "react";

declare global {
  interface Window {
    reportWebVitals?: (metric: unknown) => void;
  }
}

export function WebVitals() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Track Web Vitals if available
    if ("web-vitals" in window || typeof window.reportWebVitals === "function") {
      // Use Next.js built-in web vitals if available
      return;
    }

    // Fallback: Manual tracking for key metrics
    const trackMetric = (metric: string, value: number, id: string) => {
      // In production, send to analytics service
      if (process.env.NODE_ENV === "production") {
        // Example: Send to analytics
        // analytics.track(metric, { value, id });
        console.log(`[Web Vitals] ${metric}:`, value, id);
      }
    };

    // Track LCP (Largest Contentful Paint)
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        if (lastEntry) {
          trackMetric("LCP", lastEntry.startTime, lastEntry.startTime.toString());
        }
      }).observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      // Performance Observer not supported
    }

    // Track FID (First Input Delay)
    try {
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const fid = (entry as any).processingStart - entry.startTime;
          trackMetric("FID", fid, entry.startTime.toString());
        });
      }).observe({ entryTypes: ["first-input"] });
    } catch (e) {
      // Performance Observer not supported
    }

    // Track CLS (Cumulative Layout Shift)
    let clsValue = 0;
    try {
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            trackMetric("CLS", clsValue, entry.startTime.toString());
          }
        });
      }).observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      // Performance Observer not supported
    }
  }, []);

  return null;
}

