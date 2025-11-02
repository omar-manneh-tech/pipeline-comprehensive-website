/**
 * Content Security Policy (CSP) Configuration
 * 
 * Note: In Next.js, 'unsafe-inline' and 'unsafe-eval' are sometimes necessary
 * for Next.js internal scripts and React hydration. However, we can tighten
 * the CSP where possible by using nonces for inline scripts.
 * 
 * For production, consider implementing nonce-based CSP using Next.js middleware.
 */

/**
 * Generate CSP header value
 * This is a simplified version. For full nonce support, use Next.js middleware.
 */
export function generateCSP(): string {
  const isProduction = process.env.NODE_ENV === "production";

  // In production, we can be more strict, but Next.js still needs some flexibility
  // for React hydration and internal scripts
  const scriptSrc = isProduction
    ? "'self' 'unsafe-inline' 'unsafe-eval'" // Next.js requires this for hydration
    : "'self' 'unsafe-inline' 'unsafe-eval'"; // Development needs more flexibility

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

/**
 * TODO: For production, implement nonce-based CSP using Next.js middleware:
 * 
 * ```typescript
 * // middleware.ts
 * import { NextResponse } from 'next/server';
 * import type { NextRequest } from 'next/server';
 * 
 * export function middleware(request: NextRequest) {
 *   const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
 *   const cspHeader = `
 *     default-src 'self';
 *     script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
 *     style-src 'self' 'nonce-${nonce}';
 *     img-src 'self' data:;
 *     font-src 'self' data:;
 *     connect-src 'self';
 *   `.replace(/\s{2,}/g, ' ').trim();
 * 
 *   const response = NextResponse.next();
 *   response.headers.set('Content-Security-Policy', cspHeader);
 *   return response;
 * }
 * ```
 */

