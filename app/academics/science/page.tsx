/**
 * Science Program Page
 * Detailed information about the Science program
 */

import { HeroBanner } from "@/components/Academics/Science/HeroBanner";
import { ProgramOverview } from "@/components/Academics/Science/ProgramOverview";
import { CoreSubjects } from "@/components/Academics/Science/CoreSubjects";
import { ElectiveSubjects } from "@/components/Academics/Science/ElectiveSubjects";
import { CareerPaths } from "@/components/Academics/Science/CareerPaths";
import { ScienceFacilities } from "@/components/Academics/Science/ScienceFacilities";
import { ProgramRequirements } from "@/components/Academics/Science/ProgramRequirements";

export const metadata = {
  title: "Science Program",
  description: "Explore our Science Program at Daddy Jobe Comprehensive School. Prepare for careers in Medicine, Engineering, and Sciences with our comprehensive senior secondary science curriculum.",
};

export default function ScienceProgramPage() {
  return (
    <>
      <HeroBanner />
      <ProgramOverview />
      <CoreSubjects />
      <ElectiveSubjects />
      <CareerPaths />
      <ScienceFacilities />
      <ProgramRequirements />
    </>
  );
}

