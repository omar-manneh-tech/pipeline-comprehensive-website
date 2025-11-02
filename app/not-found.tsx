/**
 * 404 Not Found Page
 * Handles 404 errors with user-friendly messaging
 */

"use client";

import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { transitions } from "@/lib/animations/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.default}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-primary/20">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-50" />
              <div className="relative bg-primary/10 p-6 rounded-full">
                <Search className="h-12 w-12 text-primary" aria-hidden="true" />
              </div>
            </div>
          </div>

          <h1 className="text-6xl font-bold text-navy mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>

          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white"
              aria-label="Return to homepage"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                Go Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => window.history.back()}
            >
              <Link href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Go Back
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Popular Pages:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/about"
                className="text-sm text-primary hover:underline"
              >
                About
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/academics"
                className="text-sm text-primary hover:underline"
              >
                Academics
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/contact"
                className="text-sm text-primary hover:underline"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

