"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { LicenseLock } from "./LicenseLock";
import { siteConfig } from "@/config/site";

interface LicenseStatus {
  valid: boolean;
  expired: boolean;
  daysRemaining: number;
  expirationDate: string | null;
  pilotPeriod: boolean;
}

interface LicenseCheckResponse {
  status: LicenseStatus;
  message: string;
}

interface LicenseContextType {
  licenseStatus: LicenseStatus | null;
  refreshLicense: () => Promise<void>;
}

const LicenseContext = createContext<LicenseContextType>({
  licenseStatus: null,
  refreshLicense: async () => {},
});

export const useLicense = () => useContext(LicenseContext);

interface LicenseProviderProps {
  children: React.ReactNode;
}

export function LicenseProvider({ children }: LicenseProviderProps) {
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLicense = async () => {
    try {
      const endpoint = siteConfig.license.checkEndpoint || "/api/v1/license/check";
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        setLicenseStatus({
          valid: true,
          expired: false,
          daysRemaining: 0,
          expirationDate: null,
          pilotPeriod: true,
        });
        return;
      }
      
      const data: LicenseCheckResponse = await response.json();
      setLicenseStatus(data.status);
    } catch (error) {
      setLicenseStatus({
        valid: true,
        expired: false,
        daysRemaining: 0,
        expirationDate: null,
        pilotPeriod: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLicense();
    const interval = setInterval(checkLicense, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshLicense = async () => {
    await checkLicense();
  };

  if (loading) {
    return <>{children}</>;
  }

  return (
    <LicenseContext.Provider value={{ licenseStatus, refreshLicense }}>
      {licenseStatus && licenseStatus.expired && !licenseStatus.valid ? (
        <LicenseLock
          licenseStatus={licenseStatus}
          onUnlock={refreshLicense}
        />
      ) : null}
      {children}
    </LicenseContext.Provider>
  );
}

