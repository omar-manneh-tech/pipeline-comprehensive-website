/**
 * Site Configuration
 * Centralized configuration for the entire application
 * All values can be overridden via environment variables
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Daddy Jobe Comprehensive School",
  shortName: "Daddy Jobe",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Empowering Future Leaders - A Modern Educational Institution",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/images/hero/hero-main.jpg",
  logo: process.env.NEXT_PUBLIC_LOGO_URL || "/images/misc/logo.png",

  links: {
    portal: process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.daddyjobe.edu.gm",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@daddyjobe.edu.gm",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+220 123 4567",
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "123 Education Street, Banjul, The Gambia",
  },
  
      api: {
        library: process.env.NEXT_PUBLIC_LIBRARY_API_URL || "/api/library",
        features: process.env.NEXT_PUBLIC_FEATURES_API_URL || "/api/v1/features",
        subscription: process.env.NEXT_PUBLIC_SUBSCRIPTION_API_URL || "/api/v1/subscription",
      },
  
  license: {
    checkEndpoint: process.env.NEXT_PUBLIC_LICENSE_CHECK_URL || "/api/v1/license/check",
    unlockEndpoint: process.env.NEXT_PUBLIC_LICENSE_UNLOCK_URL || "/api/v1/license/unlock",
  },
  
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/daddyjobe-school",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/daddyjobe-school",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/daddyjobe-school",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/school/daddyjobe-school",
  },
} as const;

export type SiteConfig = typeof siteConfig;

