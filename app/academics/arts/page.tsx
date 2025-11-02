/**
 * Arts Program Page
 * Detailed information about the Arts program
 */

import { HeroBanner } from "@/components/Academics/Arts/HeroBanner";
import { ProgramOverview } from "@/components/Academics/Arts/ProgramOverview";
import { CoreSubjects } from "@/components/Academics/Arts/CoreSubjects";
import { ElectiveSubjects } from "@/components/Academics/Arts/ElectiveSubjects";
import { CareerPaths } from "@/components/Academics/Arts/CareerPaths";
import { ArtsFacilities } from "@/components/Academics/Arts/ArtsFacilities";
import { ProgramRequirements } from "@/components/Academics/Arts/ProgramRequirements";

export const metadata = {
  title: "Arts Program",
  description: "Explore our Arts Program at Daddy Jobe Comprehensive School. Prepare for careers in Law, Education, Journalism, and Humanities with our comprehensive senior secondary arts curriculum.",
};

export default function ArtsProgramPage() {
  return (
    <>
      <HeroBanner />
      <ProgramOverview />
      <CoreSubjects />
      <ElectiveSubjects />
      <CareerPaths />
      <ArtsFacilities />
      <ProgramRequirements />
    </>
  );
}

