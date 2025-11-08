/**
 * Science Program Page
 * Detailed information about the Science program
 */

import { HeroBanner } from "@/components/Academics/Science/HeroBanner";
import { ProgramOverview } from "@/components/Academics/Science/ProgramOverview";
import { ScienceTabs } from "@/components/Academics/Science/ScienceTabs";

export const metadata = {
  title: "Science Program",
  description: "Explore our Science Program at Daddy Jobe Comprehensive School. Prepare for careers in Medicine, Engineering, and Sciences with our comprehensive senior secondary science curriculum.",
};

export default function ScienceProgramPage() {
  return (
    <>
      <HeroBanner />
      <ProgramOverview />
      <ScienceTabs />
    </>
  );
}

