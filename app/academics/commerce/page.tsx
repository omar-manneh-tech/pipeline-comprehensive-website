/**
 * Commerce Program Page
 * Detailed information about the Commerce program
 */

import { HeroBanner } from "@/components/Academics/Commerce/HeroBanner";
import { ProgramOverview } from "@/components/Academics/Commerce/ProgramOverview";
import { CoreSubjects } from "@/components/Academics/Commerce/CoreSubjects";
import { ElectiveSubjects } from "@/components/Academics/Commerce/ElectiveSubjects";
import { CareerPaths } from "@/components/Academics/Commerce/CareerPaths";
import { CommerceFacilities } from "@/components/Academics/Commerce/CommerceFacilities";
import { ProgramRequirements } from "@/components/Academics/Commerce/ProgramRequirements";

export const metadata = {
  title: "Commerce Program",
  description: "Explore our Commerce Program at Daddy Jobe Comprehensive School. Prepare for careers in Business, Accounting, Finance, and Entrepreneurship with our comprehensive senior secondary commerce curriculum.",
};

export default function CommerceProgramPage() {
  return (
    <>
      <HeroBanner />
      <ProgramOverview />
      <CoreSubjects />
      <ElectiveSubjects />
      <CareerPaths />
      <CommerceFacilities />
      <ProgramRequirements />
    </>
  );
}

