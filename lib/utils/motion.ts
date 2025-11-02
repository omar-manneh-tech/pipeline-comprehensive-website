/**
 * Motion Utilities
 * Helper functions for reduced motion support
 */

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get safe animation duration
 * Returns 0 if user prefers reduced motion, otherwise returns the provided duration
 */
export function getSafeDuration(duration: number): number {
  if (prefersReducedMotion()) return 0;
  return duration;
}

/**
 * Get safe transition config for Framer Motion
 */
export function getSafeTransition(
  duration: number = 0.5,
  delay: number = 0
): {
  duration: number;
  delay: number;
} {
  const prefersReduced = prefersReducedMotion();
  return {
    duration: prefersReduced ? 0 : duration,
    delay: prefersReduced ? 0 : delay,
  };
}

/**
 * Conditional animation props based on reduced motion preference
 */
export function getMotionProps(
  defaultProps: Record<string, unknown>
): Record<string, unknown> {
  if (prefersReducedMotion()) {
    // Return minimal or no animation props
    return {};
  }
  return defaultProps;
}

