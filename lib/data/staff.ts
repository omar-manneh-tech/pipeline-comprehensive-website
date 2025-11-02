/**
 * Staff Data
 * Centralized data for staff and faculty members
 */

export interface FacultyMember {
  id: string;
  name: string;
  position: string;
  subject: string;
  bio: string;
  email: string;
  image: string;
}

export interface AdministrativeMember {
  id: string;
  name: string;
  position: string;
  email: string;
  phone?: string;
  image: string;
}

export const facultyMembers: FacultyMember[] = [
  {
    id: "1",
    name: "Dr. Aminata Sarr",
    position: "Head of Science Department",
    subject: "Chemistry & Physics",
    bio: "With over 15 years of experience in science education, Dr. Sarr leads our Science program with expertise and passion.",
    email: "a.sarr@daddyjobe.edu.gm",
    image: "/images/misc/placeholder_profile.jpg",
  },
  {
    id: "2",
    name: "Mr. Musa Jammeh",
    position: "Head of Commerce Department",
    subject: "Business Studies & Economics",
    bio: "An experienced educator in commerce and business studies, dedicated to preparing students for success in the business world.",
    email: "m.jammeh@daddyjobe.edu.gm",
    image: "/images/misc/placeholder_profile.jpg",
  },
  {
    id: "3",
    name: "Mrs. Fatou Ceesay",
    position: "Head of Arts Department",
    subject: "Literature & History",
    bio: "Passionate about arts and humanities, Mrs. Ceesay inspires students to appreciate culture, literature, and history.",
    email: "f.ceesay@daddyjobe.edu.gm",
    image: "/images/misc/placeholder_profile.jpg",
  },
  {
    id: "4",
    name: "Mr. Ousman Njie",
    position: "Senior Mathematics Teacher",
    subject: "Mathematics",
    bio: "Specializing in mathematics education, Mr. Njie makes complex concepts accessible and enjoyable for students.",
    email: "o.njie@daddyjobe.edu.gm",
    image: "/images/misc/placeholder_profile.jpg",
  },
  {
    id: "5",
    name: "Mrs. Isatou Jallow",
    position: "English Language Teacher",
    subject: "English Language & Literature",
    bio: "A dedicated English teacher with expertise in language and literature, fostering communication skills in students.",
    email: "i.jallow@daddyjobe.edu.gm",
    image: "/images/misc/placeholder_profile.jpg",
  },
  {
    id: "6",
    name: "Mr. Bakary Darboe",
    position: "ICT Coordinator",
    subject: "Information & Communication Technology",
    bio: "Leading our ICT program, Mr. Darboe equips students with essential digital skills for the modern world.",
    email: "b.darboe@daddyjobe.edu.gm",
    image: "/images/misc/placeholder_profile.jpg",
  },
];

export const administrativeStaff: AdministrativeMember[] = [
  {
    id: "1",
    name: "Dr. Alhagie Manneh",
    position: "Principal",
    email: "principal@daddyjobe.edu.gm",
    phone: "+220 123 4567",
    image: "/images/misc/placeholder_profile.jpg",
  },
  {
    id: "2",
    name: "Mrs. Awa Secka",
    position: "Vice Principal",
    email: "viceprincipal@daddyjobe.edu.gm",
    phone: "+220 123 4568",
    image: "/images/misc/placeholder_profile.jpg",
  },
  {
    id: "3",
    name: "Mr. Lamin Jobe",
    position: "Administrator",
    email: "admin@daddyjobe.edu.gm",
    phone: "+220 123 4569",
    image: "/images/misc/placeholder_profile.jpg",
  },
  {
    id: "4",
    name: "Mrs. Fatou Bah",
    position: "Guidance Counselor",
    email: "counselor@daddyjobe.edu.gm",
    phone: "+220 123 4570",
    image: "/images/misc/placeholder_profile.jpg",
  },
];

