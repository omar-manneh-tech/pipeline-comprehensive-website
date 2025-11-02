/**
 * Health Check API Endpoint
 * GET /api/health
 * 
 * Returns the health status of the application
 * Useful for monitoring, load balancers, and uptime checks
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Always run dynamically

export async function GET() {
  try {
    // Basic health check
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "unknown",
      version: process.env.npm_package_version || "unknown",
    };

    // Optional: Check database connection if configured
    // if (prisma) {
    //   try {
    //     await prisma.$queryRaw`SELECT 1`;
    //     healthStatus.database = "connected";
    //   } catch (error) {
    //     healthStatus.database = "disconnected";
    //     healthStatus.status = "degraded";
    //   }
    // }

    return NextResponse.json(healthStatus, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}

