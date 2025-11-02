/**
 * Client-Side Activity Tracker
 * For use in client components only - calls API endpoint instead of Prisma
 */

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
  
  // Server environment (shouldn't happen in client tracker, but fallback)
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Track user activity (client-side)
 * Calls the API endpoint instead of Prisma directly
 */
export async function trackActivity(params: TrackActivityParams): Promise<void> {
  try {
    // Call the API endpoint
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: params.action,
        path: params.path,
        sessionId: params.sessionId || generateSessionId(),
        userId: params.userId,
        metadata: params.metadata,
      }),
    }).catch(() => {
      // Silently fail - don't break the app if tracking fails
    });
  } catch (error) {
    // Silently fail - don't break the app if tracking fails
    console.debug("[Client Activity Tracker]", error);
  }
}

/**
 * Track page view (client-side)
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
 * Track click event (client-side)
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
 * Track form submission (client-side)
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

