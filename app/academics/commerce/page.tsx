/**
 * Commerce Program Page
 * Detailed information about the Commerce program
 */

import { HeroBanner } from "@/components/Academics/Commerce/HeroBanner";
import { ProgramOverview } from "@/components/Academics/Commerce/ProgramOverview";
import { CommerceTabs } from "@/components/Academics/Commerce/CommerceTabs";

export const metadata = {
  title: "Commerce Program",
  description: "Explore our Commerce Program at Daddy Jobe Comprehensive School. Prepare for careers in Business, Accounting, Finance, and Entrepreneurship with our comprehensive senior secondary commerce curriculum.",
};

export default function CommerceProgramPage() {
  return (
    <>
      <HeroBanner />
      <ProgramOverview />
      <CommerceTabs />
    </>
  );
}

