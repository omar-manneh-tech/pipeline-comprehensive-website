"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { type LicenseStatus, type LicenseCheckResponse } from "@/lib/types/license";
import { apiClient } from "@/services/api/client";

export function LicenseBanner() {
  const [isExpired, setIsExpired] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isPilot, setIsPilot] = useState(false);

  useEffect(() => {
    const checkLicense = async () => {
      try {
        // Remove /api prefix if present, since apiClient adds it
        const endpoint = (siteConfig.license.checkEndpoint || "/api/v1/license/check").replace(/^\/api/, "");
        const data = await apiClient.get<LicenseCheckResponse>(endpoint);
        const status = data.status;
        
        setIsExpired(status.expired);
        setIsPilot(status.pilotPeriod);
        setDaysRemaining(status.daysRemaining);
        setIsVisible(status.expired || (status.pilotPeriod && status.daysRemaining <= 7));
      } catch (error) {
        // Fail gracefully
        setIsVisible(false);
      }
    };

    checkLicense();
    const interval = setInterval(checkLicense, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  if (isPilot && !isExpired && daysRemaining !== null && daysRemaining <= 7) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          role="alert"
          className="relative w-full bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border-b-2 border-blue-300 shadow-lg"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="text-blue-800 font-semibold">Pilot Period Ending Soon</h4>
                <p className="text-blue-700 text-sm">
                  {daysRemaining === 0
                    ? "Your pilot period ends today."
                    : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining in pilot period.`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="ml-4 hover:bg-blue-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isExpired) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          role="alert"
          className="relative w-full bg-gradient-to-r from-red-50 via-red-100 to-red-50 border-b-2 border-red-300 shadow-lg"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="text-red-800 font-semibold">License Expired</h4>
                <p className="text-red-700 text-sm">
                  Your pilot period has ended. Please enter your unlock code to continue.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="ml-4 hover:bg-red-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}

