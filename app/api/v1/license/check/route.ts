/**
 * License Check API Route
 * GET /api/v1/license/check
 * 
 * Returns the current license status
 */

import { NextRequest, NextResponse } from "next/server";

// License utility functions (simplified for now)
function getLicenseExpirationDate(): Date | null {
  const pilotStartDate = process.env.LICENSE_PILOT_START_DATE 
    ? new Date(process.env.LICENSE_PILOT_START_DATE)
    : new Date();
  const expirationDate = new Date(pilotStartDate);
  expirationDate.setMonth(expirationDate.getMonth() + 1);
  return expirationDate;
}

function isLicenseExpired(): boolean {
  const expirationDate = getLicenseExpirationDate();
  if (!expirationDate) return false;
  return new Date() > expirationDate;
}

function getDaysRemaining(): number {
  const expirationDate = getLicenseExpirationDate();
  if (!expirationDate) return -1;
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export async function GET(request: NextRequest) {
  try {
    const expired = isLicenseExpired();
    const daysRemaining = getDaysRemaining();
    const expirationDate = getLicenseExpirationDate();
    const unlockCode = process.env.LICENSE_UNLOCK_CODE || null;
    const hasValidUnlockCode = unlockCode ? true : false;
    const isValid = !expired || hasValidUnlockCode;

    const status = {
      valid: isValid,
      expired: expired && !isValid,
      daysRemaining,
      expirationDate: expirationDate?.toISOString() || null,
      pilotPeriod: !expired,
      unlockCode: isValid && unlockCode ? "***" : null,
    };

    const response = {
      status,
      message: status.expired
        ? "License has expired. Please renew to continue using all features."
        : status.pilotPeriod
        ? `Pilot period active. ${status.daysRemaining} days remaining.`
        : "License is valid.",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("License check error:", error);
    return NextResponse.json(
      {
        status: {
          valid: true,
          expired: false,
          daysRemaining: 0,
          expirationDate: null,
          pilotPeriod: true,
        },
        message: "Unable to check license status. Please try again later.",
      },
      { status: 200 }
    );
  }
}

