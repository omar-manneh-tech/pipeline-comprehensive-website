/**
 * About Page
 * Comprehensive information about Daddy Jobe Comprehensive School
 */

import { HeroBanner } from "@/components/About/HeroBanner";
import { SchoolHistory } from "@/components/About/SchoolHistory";
import { MissionVision } from "@/components/About/MissionVision";
import { Achievements } from "@/components/About/Achievements";
import { Leadership } from "@/components/About/Leadership";

export const metadata = {
  title: "About Us",
  description: "Learn about Daddy Jobe Comprehensive School - our mission, vision, history, and commitment to academic excellence.",
};

// ISR: Revalidate every hour
export const revalidate = 3600;

export default function AboutPage() {
  return (
    <>
      <HeroBanner />
      <SchoolHistory />
      <MissionVision />
      <Achievements />
      <Leadership />
    </>
  );
}

