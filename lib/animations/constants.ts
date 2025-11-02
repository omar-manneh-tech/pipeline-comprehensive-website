/**
 * Animation Constants
 * Reusable Framer Motion animation configurations
 * Follows DRY principle - no repeated animation patterns
 */

import { Variants, Transition } from "framer-motion";

/**
 * Fade in from bottom animation
 * Most common animation pattern in the application
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Fade in from left animation
 */
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

/**
 * Fade in from right animation
 */
export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

/**
 * Fade in animation (no translation)
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Scale animation
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

/**
 * Standard transition configurations
 */
export const transitions = {
  default: {
    duration: 0.6,
    ease: [0.6, -0.05, 0.01, 0.99],
  } as Transition,
  fast: {
    duration: 0.3,
    ease: "easeOut",
  } as Transition,
  slow: {
    duration: 1,
    ease: "easeInOut",
  } as Transition,
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 25,
  } as Transition,
};

/**
 * Viewport configuration for animations
 */
export const viewportConfig = {
  once: true,
  margin: "-100px",
};

/**
 * Common animation props for whileInView animations
 */
export const commonInViewProps = {
  initial: "initial",
  whileInView: "animate",
  viewport: viewportConfig,
  transition: transitions.default,
};

/**
 * Common hover animation variants
 */
export const hoverScale: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const hoverLift: Variants = {
  rest: { y: 0 },
  hover: { y: -8 },
};

/**
 * Stagger children animation
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

