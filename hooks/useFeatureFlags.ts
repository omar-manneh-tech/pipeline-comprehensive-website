/**
 * Feature Flags Hook
 * Fetches and provides feature flags for components
 */

import { useState, useEffect } from "react";

interface FeatureFlag {
  key: string;
  enabled: boolean;
}

export function useFeatureFlags() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await fetch("/api/site/flags");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Convert array to key-value object
            const flagsMap: Record<string, boolean> = {};
            data.data.forEach((flag: FeatureFlag) => {
              flagsMap[flag.key] = flag.enabled;
            });
            setFlags(flagsMap);
          }
        }
      } catch (error) {
        console.error("[useFeatureFlags] Failed to fetch flags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();
  }, []);

  const isEnabled = (key: string): boolean => {
    return flags[key] ?? true; // Default to enabled if flag doesn't exist
  };

  return { flags, loading, isEnabled };
}

