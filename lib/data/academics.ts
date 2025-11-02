/**
 * Academics Data
 * Centralized data for academic programs
 */

import { BookOpen, Calculator, Palette } from "lucide-react";

export interface AcademicProgram {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  coreSubjects: string[];
  electiveSubjects?: string[];
  careerPaths: string;
}

export const academicPrograms: AcademicProgram[] = [
  {
    id: "1",
    name: "Science Program",
    description: "Preparing students for careers in medicine, engineering, and sciences",
    image: "/images/academics/science_lab.jpg",
    icon: Calculator,
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
    coreSubjects: [
      "Mathematics",
      "English Language",
      "Physics",
      "Chemistry",
      "Biology",
    ],
    electiveSubjects: [
      "Further Mathematics",
      "Agricultural Science",
      "Geography",
    ],
    careerPaths: "Ideal for students pursuing careers in Medicine, Engineering, Pharmacy, Nursing, Computer Science, and other science-related fields.",
  },
  {
    id: "2",
    name: "Commerce Program",
    description: "Building future business leaders, accountants, and entrepreneurs",
    image: "/images/academics/science_lab.jpg",
    icon: Calculator,
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
    coreSubjects: [
      "Mathematics",
      "English Language",
      "Economics",
      "Accounting",
      "Business Studies",
    ],
    electiveSubjects: [
      "Commerce",
      "Geography",
      "Government",
    ],
    careerPaths: "Perfect for students interested in Business Administration, Accounting, Banking, Finance, Marketing, and Entrepreneurship.",
  },
  {
    id: "3",
    name: "Arts Program",
    description: "Nurturing creative minds and future leaders in humanities and social sciences",
    image: "/images/academics/science_lab.jpg",
    icon: Palette,
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
    coreSubjects: [
      "English Language",
      "Literature in English",
      "History",
      "Government",
      "CRS/IRK",
    ],
    electiveSubjects: [
      "Geography",
      "Economics",
      "French",
      "Art",
    ],
    careerPaths: "Suitable for students aspiring to careers in Law, Education, Journalism, Public Administration, International Relations, and the Arts.",
  },
];

