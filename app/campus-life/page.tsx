/**
 * Campus Life Page
 * Comprehensive information about campus life at Daddy Jobe Comprehensive School
 */

import { CampusOverview } from "@/components/CampusLife/CampusOverview";
import { ClubsAndSocieties } from "@/components/CampusLife/ClubsAndSocieties";
import { SportsAndAthletics } from "@/components/CampusLife/SportsAndAthletics";
import { CampusFacilities } from "@/components/CampusLife/CampusFacilities";

export const metadata = {
  title: "Campus Life",
  description: "Discover the vibrant campus life at Daddy Jobe Comprehensive School - student activities, clubs, sports, and facilities that enrich student experience.",
};

// ISR: Revalidate every hour
export const revalidate = 3600;

export default function CampusLifePage() {
  return (
    <>
      <CampusOverview />
      <ClubsAndSocieties />
      <SportsAndAthletics />
      <CampusFacilities />
    </>
  );
}

