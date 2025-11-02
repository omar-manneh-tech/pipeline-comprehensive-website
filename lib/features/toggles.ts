/**
 * Feature Toggle System
 * Manages feature flags and subscription-based feature access
 */

import { siteConfig } from "@/config/site";
import { apiClient } from "@/services/api/client";

/**
 * Feature Definitions
 */
export enum Feature {
  LIBRARY = "library",
  STAFF_DIRECTORY = "staff_directory",
  GALLERY = "gallery",
  NEWS_BLOG = "news_blog",
  PORTAL_INTEGRATION = "portal_integration",
  ADVANCED_FEATURES = "advanced_features",
  CUSTOM_BRANDING = "custom_branding",
  ANALYTICS_DASHBOARD = "analytics_dashboard",
}

/**
 * Subscription Tiers
 */
export enum SubscriptionTier {
  FREE = "free",
  BASIC = "basic",
  PREMIUM = "premium",
  ENTERPRISE = "enterprise",
}

/**
 * Feature Access by Tier
 */
export const FEATURE_ACCESS: Record<SubscriptionTier, Feature[]> = {
  [SubscriptionTier.FREE]: [],
  [SubscriptionTier.BASIC]: [
    Feature.LIBRARY,
    Feature.STAFF_DIRECTORY,
    Feature.GALLERY,
  ],
  [SubscriptionTier.PREMIUM]: [
    Feature.LIBRARY,
    Feature.STAFF_DIRECTORY,
    Feature.GALLERY,
    Feature.NEWS_BLOG,
    Feature.PORTAL_INTEGRATION,
  ],
  [SubscriptionTier.ENTERPRISE]: [
    Feature.LIBRARY,
    Feature.STAFF_DIRECTORY,
    Feature.GALLERY,
    Feature.NEWS_BLOG,
    Feature.PORTAL_INTEGRATION,
    Feature.ADVANCED_FEATURES,
    Feature.CUSTOM_BRANDING,
    Feature.ANALYTICS_DASHBOARD,
  ],
};

/**
 * Get Current Subscription Tier
 * In production, this would fetch from API or database
 */
export async function getCurrentSubscriptionTier(): Promise<SubscriptionTier> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${siteConfig.api.subscription}/tier`);
  // const data = await response.json();
  // return data.tier as SubscriptionTier;

  // Default to BASIC for now
  return SubscriptionTier.BASIC;
}

/**
 * Check if a feature is enabled for the current subscription
 */
export async function isFeatureEnabled(feature: Feature): Promise<boolean> {
  const tier = await getCurrentSubscriptionTier();
  return FEATURE_ACCESS[tier].includes(feature);
}

/**
 * Get all enabled features for current subscription
 */
export async function getEnabledFeatures(): Promise<Feature[]> {
  const tier = await getCurrentSubscriptionTier();
  return FEATURE_ACCESS[tier];
}

/**
 * Client-side feature check hook
 * For use in client components
 */
export function useFeatureCheck() {
  // This would typically use React hooks, but for now we'll provide a sync version
  // In production, use React Query or SWR for async state management
  
  const checkFeature = async (feature: Feature): Promise<boolean> => {
    try {
      const endpoint = `${siteConfig.api.features || "/api/v1/features"}/check`.replace(/^\/api/, "");
      const data = await apiClient.post<{ enabled: boolean }>(endpoint, { feature });
      return data.enabled === true;
    } catch {
      // Fail gracefully - default to false
      return false;
    }
  };

  return { checkFeature };
}

