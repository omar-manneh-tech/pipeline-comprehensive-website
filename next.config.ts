import type { NextConfig } from "next";

/**
 * Next.js Configuration with Security Headers
 * Enterprise-grade security and performance settings
 */
const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Image Configuration - 100% Local Images Only
  images: {
    unoptimized: false,
    remotePatterns: [], // No external images allowed
    domains: [], // No external domains
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90], // Include quality 90
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Note: Next.js requires 'unsafe-inline' and 'unsafe-eval' for React hydration
              // In production, consider implementing nonce-based CSP via middleware
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'", // TailwindCSS requires unsafe-inline
              "img-src 'self' data:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          }
        ],
      },
    ];
  },

  // Performance Optimizations
  compress: true,
  poweredByHeader: false,
  
  // TypeScript & ESLint (moved to separate config files)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
