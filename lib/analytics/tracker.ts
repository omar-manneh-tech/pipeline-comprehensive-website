/**
 * Server-Side Activity Tracker
 * For use in API routes, server components, and middleware only
 * DO NOT import this in client components - use tracker-client.ts instead
 */

import { prisma } from "@/lib/db/client";
import { Prisma } from "@prisma/client";

export type ActivityAction =
  | "page_view"
  | "click"
  | "form_submit"
  | "download"
  | "link_click"
  | "button_click"
  | "search"
  | "scroll"
  | "time_on_page"
  | "error";

export interface ActivityMetadata {
  [key: string]: unknown;
}

export interface TrackActivityParams {
  action: ActivityAction;
  path: string;
  sessionId?: string;
  userId?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: ActivityMetadata;
}

/**
 * Track user activity
 * This function handles both database and fallback logging
 */
export async function trackActivity(params: TrackActivityParams): Promise<void> {
  const {
    action,
    path,
    sessionId = generateSessionId(),
    userId,
    referrer,
    userAgent,
    ipAddress,
    metadata,
  } = params;

  try {
    // Try to save to database if Prisma is available
    if (prisma && typeof prisma.userActivity?.create === "function") {
      await prisma.userActivity.create({
        data: {
          action,
          path,
          sessionId,
          userId: userId || null,
          referrer: referrer || null,
          userAgent: userAgent || null,
          ipAddress: ipAddress || null,
          metadata: metadata ? (metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
        },
      });
    } else {
      // Fallback: Log to console (useful during development)
      console.log("[Activity Tracker]", {
        action,
        path,
        sessionId,
        userId,
        timestamp: new Date().toISOString(),
        metadata,
      });
    }
  } catch (error) {
    // Fail silently but log error
    console.error("[Activity Tracker Error]", error);
  }
}

/**
 * Track page view
 */
export async function trackPageView(
  path: string,
  options?: {
    sessionId?: string;
    userId?: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
  }
): Promise<void> {
  await trackActivity({
    action: "page_view",
    path,
    ...options,
  });
}

/**
 * Track click event
 */
export async function trackClick(
  path: string,
  element: string,
  options?: {
    sessionId?: string;
    userId?: string;
    metadata?: ActivityMetadata;
  }
): Promise<void> {
  await trackActivity({
    action: "click",
    path,
    metadata: {
      element,
      ...options?.metadata,
    },
    ...options,
  });
}

/**
 * Track form submission
 */
export async function trackFormSubmit(
  path: string,
  formId: string,
  options?: {
    sessionId?: string;
    userId?: string;
    metadata?: ActivityMetadata;
  }
): Promise<void> {
  await trackActivity({
    action: "form_submit",
    path,
    metadata: {
      formId,
      ...options?.metadata,
    },
    ...options,
  });
}

/**
 * Generate a session ID
 * Uses localStorage or cookie in browser, or generates a new one
 */
export function generateSessionId(): string {
  if (typeof window !== "undefined") {
    // Browser environment
    const stored = localStorage.getItem("session_id");
    if (stored) return stored;
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("session_id", sessionId);
    return sessionId;
  }
  
  // Server environment
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get client identifier from request headers
 */
export function getClientInfo(request: Request): {
  ipAddress: string;
  userAgent: string;
  referrer: string | null;
} {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referrer = request.headers.get("referer");

  return {
    ipAddress,
    userAgent,
    referrer,
  };
}

