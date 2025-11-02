/**
 * Activity Tracker Component
 * Client-side component for tracking user activities
 * Automatically tracks page views and provides hooks for custom tracking
 */

"use client";

import { useEffect } from "react";
import { usePageViewTracking } from "@/hooks/useActivityTracker";
import { trackClick } from "@/lib/analytics/tracker";
import { generateSessionId } from "@/lib/analytics/tracker";
import { usePathname } from "next/navigation";

export function ActivityTracker() {
  const pathname = usePathname();
  
  // Automatically track page views
  usePageViewTracking();

  // Set up click tracking for important elements
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === "BUTTON" || target.closest("button")) {
        const button = target.closest("button") || target;
        const buttonText = button.textContent?.trim() || "Unknown Button";
        
        if (pathname) {
          trackClick(pathname, buttonText, {
            sessionId: generateSessionId(),
            metadata: {
              element: "button",
              href: button.getAttribute("href") || undefined,
            },
          }).catch(() => {
            // Silently fail
          });
        }
      }
      
      // Track link clicks
      if (target.tagName === "A" || target.closest("a")) {
        const link = target.closest("a") || target;
        const href = link.getAttribute("href");
        if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
          if (pathname) {
            trackClick(pathname, link.textContent?.trim() || href, {
              sessionId: generateSessionId(),
              metadata: {
                element: "link",
                href: href,
              },
            }).catch(() => {
              // Silently fail
            });
          }
        }
      }
    };

    // Add click listener
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname]);

  return null; // This component doesn't render anything
}

