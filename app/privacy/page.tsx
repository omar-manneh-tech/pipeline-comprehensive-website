/**
 * Privacy Policy Page
 * Legal requirement for data protection and privacy compliance
 */

import { HeroBanner } from "@/components/Privacy/HeroBanner";
import { PrivacyContent } from "@/components/Privacy/PrivacyContent";
import { ContactPrivacy } from "@/components/Privacy/ContactPrivacy";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Daddy Jobe Comprehensive School - Learn how we collect, use, and protect your personal information.",
};

// ISR: Revalidate daily (privacy policy changes infrequently)
export const revalidate = 86400;

export default function PrivacyPage() {
  return (
    <>
      <HeroBanner />
      <PrivacyContent />
      <ContactPrivacy />
    </>
  );
}

