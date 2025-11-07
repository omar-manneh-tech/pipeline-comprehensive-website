/**
 * Staff Page
 * Information about the school staff and faculty members
 */

import { StaffOverview } from "@/components/Staff/StaffOverview";
import { FacultyMembers } from "@/components/Staff/FacultyMembers";
import { AdministrativeStaff } from "@/components/Staff/AdministrativeStaff";
import { StaffExcellence } from "@/components/Staff/StaffExcellence";

export const metadata = {
  title: "Staff",
  description: "Meet our dedicated and experienced faculty and administrative staff at Daddy Jobe Comprehensive School.",
};

// ISR: Revalidate every hour
export const revalidate = 3600;

export default function StaffPage() {
  return (
    <>
      <StaffOverview />
      <FacultyMembers />
      <AdministrativeStaff />
      <StaffExcellence />
    </>
  );
}

