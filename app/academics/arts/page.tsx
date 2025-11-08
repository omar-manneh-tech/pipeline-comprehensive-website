/**
 * Arts Program Page
 * Detailed information about the Arts program
 */

import { HeroBanner } from "@/components/Academics/Arts/HeroBanner";
import { ProgramOverview } from "@/components/Academics/Arts/ProgramOverview";
import { ArtsTabs } from "@/components/Academics/Arts/ArtsTabs";

export const metadata = {
  title: "Arts Program",
  description: "Explore our Arts Program at Daddy Jobe Comprehensive School. Prepare for careers in Law, Education, Journalism, and Humanities with our comprehensive senior secondary arts curriculum.",
};

export default function ArtsProgramPage() {
  return (
    <>
      <HeroBanner />
      <ProgramOverview />
      <ArtsTabs />
    </>
  );
}

