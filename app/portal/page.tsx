/**
 * Portal Page
 * School portal access page
 */

import { HeroBanner } from "@/components/Portal/HeroBanner";
import { PortalOverview } from "@/components/Portal/PortalOverview";
import { PortalFeatures } from "@/components/Portal/PortalFeatures";
import { PortalAccess } from "@/components/Portal/PortalAccess";

export const metadata = {
  title: "Portal",
  description: "Access the Daddy Jobe Comprehensive School portal for students, parents, and staff to manage academic information, grades, attendance, and more.",
};

// ISR: Revalidate every hour
export const revalidate = 3600;

export default function PortalPage() {
  return (
    <>
      <HeroBanner />
      <PortalOverview />
      <PortalFeatures />
      <PortalAccess />
    </>
  );
}

