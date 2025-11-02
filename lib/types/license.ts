/**
 * License Types
 * Shared types for license management across the application
 */

export interface LicenseStatus {
  valid: boolean;
  expired: boolean;
  daysRemaining: number;
  expirationDate: string | null;
  pilotPeriod: boolean;
  unlockCode?: string | null;
}

export interface LicenseCheckResponse {
  status: LicenseStatus;
  message: string;
}

export interface LicenseUnlockRequest {
  unlockCode: string;
}

export interface LicenseUnlockResponse {
  success: boolean;
  message: string;
  status?: LicenseStatus;
}

