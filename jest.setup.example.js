/**
 * Jest Setup File
 * Configure testing environment for the project
 * 
 * To use:
 * 1. Copy this file to jest.setup.js
 * 2. Install testing dependencies (see package.json.test-setup)
 * 3. Update package.json with test scripts
 */

import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    // Add other motion components as needed
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

