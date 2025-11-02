/**
 * Next.js Middleware
 * Runs on every request to the website
 * Used for tracking page views, authentication, etc.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes (except login)
  // Note: We only protect API routes here, not page routes
  // Page routes are protected by client-side checks because:
  // 1. Middleware runs on Edge Runtime (no localStorage access)
  // 2. Tokens are stored in localStorage (client-side only)
  // 3. API routes can read Authorization header, pages cannot
  
  // Only protect API routes in middleware
  // Page routes are protected client-side in the page component itself
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/auth")) {
    const auth = verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required. Please log in to access admin features.",
        },
        { status: 401 }
      );
    }
  }

  // Note: Page view tracking is handled by client-side ActivityTracker component
  // Middleware runs on Edge Runtime which doesn't support Prisma
  // Tracking happens via API endpoint called from client-side

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

