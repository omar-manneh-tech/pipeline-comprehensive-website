/**
 * Error Handler Component
 * Suppresses harmless browser extension errors from cluttering the console
 */

"use client";

import { useEffect } from "react";

export function ErrorHandler() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // List of error patterns to suppress (browser extension errors)
    const suppressedErrorPatterns = [
      /message channel closed/i,
      /asynchronous response.*returning true/i,
      /Extension context invalidated/i,
      /Receiving end does not exist/i,
      /chrome-extension:/i,
      /moz-extension:/i,
    ];

    // Override console.error to filter out extension errors
    const originalConsoleError = console.error.bind(console);
    
    console.error = (...args: unknown[]) => {
      // Check if the error message matches any suppressed pattern
      const errorMessage = args.join(" ");
      const shouldSuppress = suppressedErrorPatterns.some((pattern) =>
        pattern.test(errorMessage)
      );

      // Only log if it's not a suppressed error
      if (!shouldSuppress) {
        originalConsoleError(...args);
      }
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = String(event.reason || "");
      const shouldSuppress = suppressedErrorPatterns.some((pattern) =>
        pattern.test(errorMessage)
      );

      if (shouldSuppress) {
        // Suppress the error
        event.preventDefault();
      }
    };

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || String(event.error || "");
      const shouldSuppress = suppressedErrorPatterns.some((pattern) =>
        pattern.test(errorMessage)
      );

      if (shouldSuppress) {
        // Suppress the error
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    // Cleanup
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null; // This component doesn't render anything
}

