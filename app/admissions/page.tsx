/**
 * Admissions Page
 * Information about the admission process, requirements, and timeline
 */

import { HeroBanner } from "@/components/Admissions/HeroBanner";
import { AdmissionProcess } from "@/components/Admissions/AdmissionProcess";
import { AdmissionsInfoTabs } from "@/components/Admissions/AdmissionsInfoTabs";

export const metadata = {
  title: "Admissions",
  description: "Start your journey with Daddy Jobe Comprehensive School. Learn about our admission process, requirements, and important dates for Grade 10 enrollment.",
};

// ISR: Revalidate every hour
export const revalidate = 3600;

export default function AdmissionsPage() {
  return (
    <>
      <HeroBanner />
      <AdmissionProcess />
      <AdmissionsInfoTabs />
    </>
  );
}

