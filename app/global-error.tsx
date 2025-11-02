"use client";

/**
 * Global Error Boundary
 * Handles errors that occur in the root layout
 */

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === "production") {
      console.error("Global application error:", error);
      // Example: Send to error tracking service
      // errorTrackingService.log(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4">
          <div className="max-w-md w-full text-center">
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
                Application Error
              </h1>

              <p className="text-gray-600 mb-6">
                    A critical error occurred. Please refresh the page or return to the homepage.
              </p>

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
          </div>
        </div>
      </body>
    </html>
  );
}

