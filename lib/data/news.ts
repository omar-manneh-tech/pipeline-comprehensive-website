/**
 * News & Events Data
 * Centralized data for news articles and events
 */

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  date: string;
  author?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  image?: string;
}

export const latestNews: NewsArticle[] = [
  {
    id: "1",
    title: "2025 WASSCE Results Celebration",
    excerpt: "Congratulations to all our students who excelled in the West African Senior Secondary Certification Examination. Our school achieved an outstanding 95% pass rate.",
    image: "/images/gallery/graduation_day.png",
    category: "Achievements",
    date: "January 15, 2025",
    author: "Principal's Office",
  },
  {
    id: "2",
    title: "New Science Laboratory Opens",
    excerpt: "We're excited to announce the opening of our state-of-the-art science laboratory, equipped with modern facilities to enhance practical learning for Science program students.",
    image: "/images/academics/science_lab.png",
    category: "Academics",
    date: "January 10, 2025",
    author: "Academic Department",
  },
  {
    id: "3",
    title: "Admission Application Period Now Open",
    excerpt: "Applications for Grade 10 enrollment (2025-2026 academic year) are now being accepted. Learn about our admission process and requirements.",
    image: "/images/hero/admission.png",
    category: "Announcements",
    date: "February 1, 2025",
    author: "Admissions Office",
  },
  {
    id: "4",
    title: "Science Fair 2025 Registration",
    excerpt: "Students are invited to participate in our annual Science Fair. Showcase your innovative projects and compete for prestigious awards.",
    image: "/images/gallery/science_fair_day.png",
    category: "Student Life",
    date: "January 20, 2025",
    author: "Science Department",
  },
  {
    id: "5",
    title: "Sports Day Champions Announced",
    excerpt: "Congratulations to all participants in our annual Sports Day. The Commerce program emerged as overall champions this year!",
    image: "/images/gallery/sport_day.png",
    category: "Student Life",
    date: "January 5, 2025",
    author: "Sports Department",
  },
  {
    id: "6",
    title: "University Scholarship Program",
    excerpt: "Several of our graduates have been awarded scholarships to the University of The Gambia and other prestigious institutions. Read their inspiring stories.",
    image: "/images/gallery/graduation_day.png",
    category: "Achievements",
    date: "December 20, 2024",
    author: "Guidance & Counseling",
  },
];

export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Open House & School Tour",
    description: "Prospective students and parents are invited to tour our facilities, meet our teachers, and learn about our programs.",
    date: "February 15, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "School Campus",
  },
  {
    id: "2",
    title: "Parent-Teacher Conference",
    description: "Scheduled parent-teacher conferences to discuss student progress and academic performance for the first term.",
    date: "February 28, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "School Campus",
  },
  {
    id: "3",
    title: "Cultural Day Celebration",
    description: "Celebrate the rich cultural diversity of our student body through performances, traditional displays, and cultural activities.",
    date: "March 15, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "School Grounds",
  },
  {
    id: "4",
    title: "WASSCE Preparation Workshop",
    description: "Intensive workshop for Grade 12 students preparing for the WASSCE examinations. Tips, strategies, and practice sessions.",
    date: "March 22, 2025",
    time: "8:00 AM - 4:00 PM",
    location: "School Auditorium",
  },
  {
    id: "5",
    title: "Debate Competition Finals",
    description: "Witness the final round of our annual inter-program debate competition. Students from Science, Commerce, and Arts programs compete.",
    date: "April 5, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "School Auditorium",
  },
  {
    id: "6",
    title: "Career Guidance Seminar",
    description: "University representatives and career counselors will provide guidance on career paths, university admission, and scholarship opportunities.",
    date: "April 12, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "School Auditorium",
  },
];

