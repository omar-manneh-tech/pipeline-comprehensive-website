/**
 * Rate Limiting Utility
 * Simple in-memory rate limiting for API routes
 * For production, use Redis or a dedicated service
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }

  check(key: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const record = this.store[key];

    // No record exists or window expired
    if (!record || record.resetTime < now) {
      this.store[key] = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      };
    }

    // Window still active
    if (record.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    // Increment counter
    record.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime,
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.store = {};
  }

  /**
   * Clear rate limit for a specific key (useful for testing)
   */
  clear(key: string): void {
    delete this.store[key];
  }

  /**
   * Clear all rate limits (useful for testing/reset)
   */
  clearAll(): void {
    this.store = {};
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Rate Limit Middleware
 * Usage: const result = rateLimit(identifier, { windowMs: 60000, maxRequests: 10 });
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  headers: HeadersInit;
} {
  const result = rateLimiter.check(identifier, config);
  
  const headers: HeadersInit = {
    "X-RateLimit-Limit": config.maxRequests.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
  };

  return {
    ...result,
    headers,
  };
}

/**
 * Clear rate limit for a specific identifier (useful for testing)
 */
export function clearRateLimit(identifier: string): void {
  rateLimiter.clear(identifier);
}

/**
 * Clear all rate limits (useful for testing/reset)
 */
export function clearAllRateLimits(): void {
  rateLimiter.clearAll();
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers (common in production)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent") || "";
  
  // For development, combine IP with user agent for better uniqueness
  // In production, you'd extract the real IP
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
  
  // In development, use IP + user agent hash for better uniqueness
  // This prevents all requests from being grouped under "unknown"
  if (process.env.NODE_ENV === "development" && ip === "unknown") {
    // Create a simple hash from user agent for uniqueness
    const hash = userAgent.split("").reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
    }, 0);
    return `dev-${Math.abs(hash)}`;
  }
  
  return ip;
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: "Too many requests. Please try again later.",
  },
  license: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
    message: "Too many license check requests. Please try again later.",
  },
  contact: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3, // 3 requests per 15 minutes
    message: "Too many contact form submissions. Please try again later.",
  },
} as const;

