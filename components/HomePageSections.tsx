/**
 * Home Page Sections Wrapper
 * Fetches sections from CMS and conditionally renders based on visibility and feature flags
 */

"use client";

import { useState, useEffect, ReactNode } from "react";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

interface PageSection {
  id: string;
  section: string;
  visible: boolean;
  order: number;
}

interface HomePageSectionsProps {
  children: ReactNode;
}

// Section mapping: component key -> section name in CMS
const SECTION_MAP: Record<string, string> = {
  hero: "hero",
  about: "about",
  core_values: "core_values",
  student_life: "student_life",
  library: "library",
  statistics: "statistics",
  events: "events",
  explore: "explore",
  testimonials: "testimonials",
};

// Feature flag mapping: component key -> feature flag key
const FEATURE_FLAG_MAP: Record<string, string> = {
  events: "events_carousel",
  testimonials: "testimonials",
  statistics: "statistics",
};

export function HomePageSections({ children }: HomePageSectionsProps) {
  const [sections, setSections] = useState<PageSection[]>([]);
  const { isEnabled } = useFeatureFlags();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("/api/site/pages?page=home");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSections(data.data);
          }
        }
      } catch (error) {
        console.error("[HomePageSections] Failed to fetch sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  // Check if a section should be visible
  const isSectionVisible = (sectionKey: string): boolean => {
    // If loading, show all sections (fallback behavior)
    if (loading) return true;

    // Check feature flag first
    const featureFlagKey = FEATURE_FLAG_MAP[sectionKey];
    if (featureFlagKey && !isEnabled(featureFlagKey)) {
      return false;
    }

    // Check CMS section visibility
    const cmsSectionName = SECTION_MAP[sectionKey];
    if (cmsSectionName) {
      const section = sections.find((s) => s.section === cmsSectionName);
      if (section) {
        return section.visible;
      }
      // If section exists in CMS but not found, it might not be created yet
      // Return true to show default content
      return true;
    }

    // Default: show all sections
    return true;
  };

  // Filter children based on visibility
  // Map children to section keys (this is a simplified approach)
  const childrenArray = Array.isArray(children) ? children : [children];
  const sectionKeys = [
    "hero",
    "about",
    "core_values",
    "student_life",
    "library",
    "statistics",
    "events",
    "explore",
    "testimonials",
  ];

  const filteredChildren = childrenArray.map((child, index) => {
    const sectionKey = sectionKeys[index];
    if (sectionKey && !isSectionVisible(sectionKey)) {
      return null;
    }
    return child;
  }).filter(Boolean);

  return <>{filteredChildren}</>;
}
