"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Key, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

interface LicenseStatus {
  valid: boolean;
  expired: boolean;
  daysRemaining: number;
  expirationDate: string | null;
  pilotPeriod: boolean;
}

interface LicenseLockProps {
  licenseStatus: LicenseStatus;
  onUnlock?: () => void;
}

export function LicenseLock({ licenseStatus, onUnlock }: LicenseLockProps) {
  const [unlockCode, setUnlockCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setError(null);
    setSuccess(false);
    setUnlockCode("");
  }, [licenseStatus]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(siteConfig.license.unlockEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unlockCode }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.licenseStatus?.valid) {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        onUnlock?.();
      } else {
        setError(data.message || "Invalid unlock code. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!licenseStatus.expired || licenseStatus.valid) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-primary to-navy opacity-90" />
        
        <Card className="relative z-10 max-w-md w-full shadow-2xl border-2 border-gold/30">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-16 w-16 text-gold animate-pulse" />
            </div>
            <CardTitle className="text-3xl text-gray-900 mb-2">
              License Expired
            </CardTitle>
            <CardDescription className="text-lg">
              Your pilot period has ended. Please enter your unlock code to continue.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Lock className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    License Activated!
                  </h3>
                  <p className="text-gray-600">
                    Your website is being unlocked. Please wait...
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleUnlock}
                  className="space-y-4"
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                    >
                      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="unlockCode"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      Unlock Code
                    </label>
                    <input
                      id="unlockCode"
                      type="text"
                      value={unlockCode}
                      onChange={(e) => setUnlockCode(e.target.value)}
                      placeholder="Enter your unlock code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-lg text-center font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                      disabled={loading}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-navy hover:bg-navy/90 text-white"
                    disabled={loading || !unlockCode.trim()}
                  >
                    {loading ? "Validating..." : "Unlock Website"}
                  </Button>

                  <p className="text-sm text-center text-gray-500 mt-4">
                    Need an unlock code? Contact{" "}
                    <a
                      href={`mailto:${siteConfig.links.email}`}
                      className="text-primary hover:underline font-semibold"
                    >
                      {siteConfig.links.email}
                    </a>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

