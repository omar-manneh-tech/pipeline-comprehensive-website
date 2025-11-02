"use client";

/**
 * Error Boundary Component
 * Handles errors in the application and provides user-friendly error messages
 */

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { transitions } from "@/lib/animations/constants";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === "production") {
      console.error("Application error:", error);
      // Example: Send to error tracking service
      // errorTrackingService.log(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.default}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-red-200">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50" />
              <div className="relative bg-red-50 p-6 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600" aria-hidden="true" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h1>

          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Please try again or return to the homepage.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-mono text-gray-700 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              className="bg-primary hover:bg-primary/90 text-white"
              aria-label="Try again"
            >
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Try Again
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Link href="/" aria-label="Return to homepage">
                <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

