# 🎛️ Feature Toggle System Design
## Subscription-Based Feature Management

---

## 📋 REQUIREMENTS ANALYSIS

### Required Capabilities:
1. ✅ Turn features ON/OFF based on subscription status
2. ✅ Support monthly/yearly subscriptions
3. ✅ No subscription = limited features
4. ✅ Subscription expired = features disabled
5. ✅ Different tiers = different feature sets

### Features to Control:
- Library System
- Staff Directory  
- Gallery
- News/Blog
- Portal Integration
- Advanced Features
- Custom Branding
- Analytics Dashboard

---

## 🏗️ ARCHITECTURE DESIGN

### 1. Data Model

```typescript
// lib/features/types.ts

export enum SubscriptionTier {
  FREE = "free",           // No subscription - limited features
  MONTHLY = "monthly",     // Monthly subscription
  YEARLY = "yearly",       // Yearly subscription
  ENTERPRISE = "enterprise", // Enterprise subscription
}

export enum FeatureFlag {
  // Essential Features
  LIBRARY = "library",
  STAFF_DIRECTORY = "staff_directory",
  GALLERY = "gallery",
  NEWS = "news",
  PORTAL = "portal",
  
  // Advanced Features
  ADVANCED_ANALYTICS = "advanced_analytics",
  CUSTOM_BRANDING = "custom_branding",
  MULTI_LANGUAGE = "multi_language",
  API_ACCESS = "api_access",
  WHITE_LABEL = "white_label",
}

export interface FeatureConfig {
  [FeatureFlag.LIBRARY]: boolean;
  [FeatureFlag.STAFF_DIRECTORY]: boolean;
  [FeatureFlag.GALLERY]: boolean;
  [FeatureFlag.NEWS]: boolean;
  [FeatureFlag.PORTAL]: boolean;
  [FeatureFlag.ADVANCED_ANALYTICS]: boolean;
  [FeatureFlag.CUSTOM_BRANDING]: boolean;
  [FeatureFlag.MULTI_LANGUAGE]: boolean;
  [FeatureFlag.API_ACCESS]: boolean;
  [FeatureFlag.WHITE_LABEL]: boolean;
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  active: boolean;
  expiresAt: string | null;
  startedAt: string;
  features: FeatureConfig;
}

export interface FeatureCheckResult {
  enabled: boolean;
  reason?: string;
  subscriptionTier?: SubscriptionTier;
}
```

### 2. Feature Configuration by Tier

```typescript
// lib/features/config.ts

export const FEATURE_BY_TIER: Record<SubscriptionTier, FeatureConfig> = {
  [SubscriptionTier.FREE]: {
    library: false,
    staff_directory: false,
    gallery: true,
    news: false,
    portal: false,
    advanced_analytics: false,
    custom_branding: false,
    multi_language: false,
    api_access: false,
    white_label: false,
  },
  
  [SubscriptionTier.MONTHLY]: {
    library: true,
    staff_directory: true,
    gallery: true,
    news: true,
    portal: true,
    advanced_analytics: false,
    custom_branding: true,
    multi_language: false,
    api_access: false,
    white_label: false,
  },
  
  [SubscriptionTier.YEARLY]: {
    library: true,
    staff_directory: true,
    gallery: true,
    news: true,
    portal: true,
    advanced_analytics: true,
    custom_branding: true,
    multi_language: true,
    api_access: true,
    white_label: false,
  },
  
  [SubscriptionTier.ENTERPRISE]: {
    library: true,
    staff_directory: true,
    gallery: true,
    news: true,
    portal: true,
    advanced_analytics: true,
    custom_branding: true,
    multi_language: true,
    api_access: true,
    white_label: true,
  },
};
```

### 3. Feature Toggle Service

```typescript
// lib/features/service.ts

import { FeatureFlag, SubscriptionTier, FeatureConfig, FeatureCheckResult } from "./types";
import { FEATURE_BY_TIER } from "./config";

export class FeatureToggleService {
  /**
   * Get subscription tier from license/subscription status
   */
  static getSubscriptionTier(
    licenseValid: boolean,
    licenseExpired: boolean,
    subscriptionType?: string
  ): SubscriptionTier {
    // If license expired, return FREE tier
    if (licenseExpired || !licenseValid) {
      return SubscriptionTier.FREE;
    }
    
    // Determine tier from subscription type or default to MONTHLY
    switch (subscriptionType) {
      case "yearly":
        return SubscriptionTier.YEARLY;
      case "enterprise":
        return SubscriptionTier.ENTERPRISE;
      case "monthly":
      default:
        return SubscriptionTier.MONTHLY;
    }
  }
  
  /**
   * Get feature configuration for a subscription tier
   */
  static getFeaturesForTier(tier: SubscriptionTier): FeatureConfig {
    return FEATURE_BY_TIER[tier];
  }
  
  /**
   * Check if a specific feature is enabled
   */
  static isFeatureEnabled(
    feature: FeatureFlag,
    tier: SubscriptionTier
  ): FeatureCheckResult {
    const features = this.getFeaturesForTier(tier);
    const enabled = features[feature];
    
    return {
      enabled,
      reason: enabled ? undefined : `Feature requires ${tier === SubscriptionTier.FREE ? "a subscription" : "higher tier"}`,
      subscriptionTier: tier,
    };
  }
  
  /**
   * Get all enabled features for a tier
   */
  static getEnabledFeatures(tier: SubscriptionTier): FeatureFlag[] {
    const features = this.getFeaturesForTier(tier);
    return Object.entries(features)
      .filter(([_, enabled]) => enabled)
      .map(([feature]) => feature as FeatureFlag);
  }
}
```

### 4. React Hook for Feature Toggles

```typescript
// hooks/useFeatureToggle.ts

import { useContext } from "react";
import { FeatureContext } from "@/providers/FeatureProvider";
import { FeatureFlag } from "@/lib/features/types";

export function useFeatureToggle(feature: FeatureFlag): {
  enabled: boolean;
  reason?: string;
  tier?: string;
} {
  const context = useContext(FeatureContext);
  
  if (!context) {
    throw new Error("useFeatureToggle must be used within FeatureProvider");
  }
  
  const { features, subscriptionTier } = context;
  const enabled = features[feature] ?? false;
  
  return {
    enabled,
    reason: enabled ? undefined : "This feature requires an active subscription",
    tier: subscriptionTier,
  };
}
```

### 5. Feature Provider Component

```typescript
// providers/FeatureProvider.tsx

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { FeatureConfig, SubscriptionTier } from "@/lib/features/types";
import { FeatureToggleService } from "@/lib/features/service";

interface FeatureContextType {
  features: FeatureConfig;
  subscriptionTier: SubscriptionTier;
  subscriptionActive: boolean;
  refresh: () => Promise<void>;
}

const FeatureContext = createContext<FeatureContextType | null>(null);

export const useFeatures = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeatures must be used within FeatureProvider");
  }
  return context;
};

interface FeatureProviderProps {
  children: ReactNode;
}

export function FeatureProvider({ children }: FeatureProviderProps) {
  const [features, setFeatures] = useState<FeatureConfig>(
    FeatureToggleService.getFeaturesForTier(SubscriptionTier.FREE)
  );
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(
    SubscriptionTier.FREE
  );
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  
  const checkSubscription = async () => {
    try {
      // Check license/subscription status
      const licenseResponse = await fetch("/api/v1/license/check");
      const licenseData = await licenseResponse.json();
      
      // Get subscription status (if you have a subscription API)
      const subscriptionResponse = await fetch("/api/v1/subscription/status");
      const subscriptionData = await subscriptionResponse.json();
      
      const tier = FeatureToggleService.getSubscriptionTier(
        licenseData.status.valid,
        licenseData.status.expired,
        subscriptionData.tier
      );
      
      const featureConfig = FeatureToggleService.getFeaturesForTier(tier);
      
      setSubscriptionTier(tier);
      setFeatures(featureConfig);
      setSubscriptionActive(tier !== SubscriptionTier.FREE && !licenseData.status.expired);
    } catch (error) {
      // Default to FREE tier on error
      setSubscriptionTier(SubscriptionTier.FREE);
      setFeatures(FeatureToggleService.getFeaturesForTier(SubscriptionTier.FREE));
      setSubscriptionActive(false);
    }
  };
  
  useEffect(() => {
    checkSubscription();
    // Refresh every hour
    const interval = setInterval(checkSubscription, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <FeatureContext.Provider
      value={{
        features,
        subscriptionTier,
        subscriptionActive,
        refresh: checkSubscription,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
}
```

### 6. API Routes

```typescript
// app/api/v1/features/check/route.ts

import { NextRequest, NextResponse } from "next/server";
import { FeatureToggleService } from "@/lib/features/service";
import { FeatureFlag } from "@/lib/features/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feature = searchParams.get("feature") as FeatureFlag;
    
    if (!feature) {
      return NextResponse.json(
        { error: "Feature parameter required" },
        { status: 400 }
      );
    }
    
    // Get subscription status (from license or subscription API)
    const licenseResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/license/check`
    );
    const licenseData = await licenseResponse.json();
    
    const tier = FeatureToggleService.getSubscriptionTier(
      licenseData.status.valid,
      licenseData.status.expired
    );
    
    const result = FeatureToggleService.isFeatureEnabled(feature, tier);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { enabled: false, error: "Failed to check feature status" },
      { status: 500 }
    );
  }
}
```

### 7. Component Integration Example

```typescript
// components/LibrarySection.tsx

"use client";

import { useFeatureToggle } from "@/hooks/useFeatureToggle";
import { FeatureFlag } from "@/lib/features/types";
import { Lock } from "lucide-react";

export function LibrarySection() {
  const { enabled, reason } = useFeatureToggle(FeatureFlag.LIBRARY);
  
  if (!enabled) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Lock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Library Feature Unavailable
          </h2>
          <p className="text-gray-600 mb-4">{reason}</p>
          <a
            href="/subscription"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Subscribe to Enable
          </a>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-20 bg-white">
      {/* Library content */}
    </section>
  );
}
```

---

## 🔄 SUBSCRIPTION MANAGEMENT

### Subscription Status API

```typescript
// app/api/v1/subscription/status/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get subscription from database or external service
    // For now, using environment variables
    
    const subscriptionStatus = {
      tier: process.env.SUBSCRIPTION_TIER || "free",
      active: process.env.SUBSCRIPTION_ACTIVE === "true",
      expiresAt: process.env.SUBSCRIPTION_EXPIRES_AT || null,
      startedAt: process.env.SUBSCRIPTION_STARTED_AT || null,
    };
    
    return NextResponse.json(subscriptionStatus, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        tier: "free",
        active: false,
        expiresAt: null,
        startedAt: null,
      },
      { status: 200 }
    );
  }
}
```

---

## 📊 IMPLEMENTATION PRIORITY

### Phase 1: Core Feature Toggle System (Week 1)
1. ✅ Create types and configuration
2. ✅ Implement FeatureToggleService
3. ✅ Create FeatureProvider component
4. ✅ Create useFeatureToggle hook
5. ✅ Add feature check API

### Phase 2: Integration (Week 2)
1. ✅ Integrate with License system
2. ✅ Add FeatureProvider to layout
3. ✅ Update components to use feature toggles
4. ✅ Create subscription status API
5. ✅ Add subscription management UI

### Phase 3: Subscription Management (Week 3)
1. ✅ Payment integration
2. ✅ Subscription activation
3. ✅ Renewal system
4. ✅ Expiration handling
5. ✅ Admin dashboard

---

## ✅ BENEFITS

1. **Granular Control:** Turn individual features on/off
2. **Subscription-Based:** Different tiers = different features
3. **No Code Changes:** Toggle features without redeployment
4. **Scalable:** Easy to add new features/tiers
5. **Type-Safe:** Full TypeScript support

---

## 🎯 NEXT STEPS

1. Implement the feature toggle system
2. Integrate with existing license system
3. Update components to respect feature flags
4. Add subscription management UI
5. Test with different subscription tiers

---

**Status:** 📋 **DESIGNED - READY FOR IMPLEMENTATION**

