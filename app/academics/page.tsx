/**
 * Academics Page
 * Information about academic programs, courses, and resources
 */

import { HeroBanner } from "@/components/Academics/HeroBanner";
import { AcademicsOverview } from "@/components/Academics/AcademicsOverview";
import { AcademicPrograms } from "@/components/Academics/AcademicPrograms";
import { AcademicFacilities } from "@/components/Academics/AcademicFacilities";
import { WASSCEPreparation } from "@/components/Academics/WASSCEPreparation";

export const metadata = {
  title: "Academics",
  description: "Explore our senior secondary academic programs: Science, Commerce, and Arts. Preparing students for WASSCE exams and university admission at Daddy Jobe Comprehensive School.",
};

// ISR: Revalidate every hour
export const revalidate = 3600;

export default function AcademicsPage() {
  return (
    <>
      <HeroBanner />
      <AcademicsOverview />
      <AcademicPrograms />
      <AcademicFacilities />
      <WASSCEPreparation />
    </>
  );
}

