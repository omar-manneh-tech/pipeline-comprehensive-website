/**
 * Root Loading State
 * Shown during initial page load and navigation
 */

import { LoadingSpinner } from "@/components/Shared/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

