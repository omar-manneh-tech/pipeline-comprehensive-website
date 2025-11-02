/**
 * Next.js Middleware
 * Runs on every request to the website
 * Used for tracking page views, authentication, etc.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { trackActivity, getClientInfo } from "@/lib/analytics/tracker";

export async function middleware(request: NextRequest) {
  // Skip tracking for API routes, static files, and admin routes (to avoid infinite loops)
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }

  // Track page view in background (non-blocking)
  const clientInfo = getClientInfo(request);
  
  // Don't await - let it run in background
  trackActivity({
    action: "page_view",
    path: pathname,
    referrer: clientInfo.referrer || undefined,
    userAgent: clientInfo.userAgent,
    ipAddress: clientInfo.ipAddress !== "unknown" ? clientInfo.ipAddress : undefined,
  }).catch((error) => {
    // Silently fail - don't break the request
    console.error("[Middleware Tracking Error]", error);
  });

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};

