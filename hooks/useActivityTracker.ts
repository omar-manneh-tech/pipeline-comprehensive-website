/**
 * React Hook for Activity Tracking
 * Provides easy-to-use hooks for tracking user activities
 */

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { trackActivity, trackPageView, trackClick, trackFormSubmit, generateSessionId } from "@/lib/analytics/tracker-client";
import type { ActivityAction, ActivityMetadata } from "@/lib/analytics/tracker-client";

/**
 * Hook to automatically track page views
 */
export function usePageViewTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view when pathname changes
    if (pathname) {
      const sessionId = generateSessionId();
      trackPageView(pathname, {
        sessionId,
      }).catch((error) => {
        console.error("[Page View Tracking Error]", error);
      });
    }
  }, [pathname]);
}

/**
 * Hook to track click events
 */
export function useClickTracking() {
  const pathname = usePathname();
  const sessionId = generateSessionId();

  const track = useCallback(
    (element: string, metadata?: ActivityMetadata) => {
      if (pathname) {
        trackClick(pathname, element, {
          sessionId,
          metadata,
        }).catch((error) => {
          console.error("[Click Tracking Error]", error);
        });
      }
    },
    [pathname, sessionId]
  );

  return { trackClick: track };
}

/**
 * Hook to track form submissions
 */
export function useFormTracking() {
  const pathname = usePathname();
  const sessionId = generateSessionId();

  const track = useCallback(
    (formId: string, metadata?: ActivityMetadata) => {
      if (pathname) {
        trackFormSubmit(pathname, formId, {
          sessionId,
          metadata,
        }).catch((error) => {
          console.error("[Form Tracking Error]", error);
        });
      }
    },
    [pathname, sessionId]
  );

  return { trackFormSubmit: track };
}

/**
 * Generic activity tracking hook
 */
export function useActivityTracking() {
  const pathname = usePathname();
  const sessionId = generateSessionId();

  const track = useCallback(
    (action: ActivityAction, metadata?: ActivityMetadata) => {
      if (pathname) {
        trackActivity({
          action,
          path: pathname,
          sessionId,
          metadata,
        }).catch((error) => {
          console.error("[Activity Tracking Error]", error);
        });
      }
    },
    [pathname, sessionId]
  );

  return { trackActivity: track };
}

