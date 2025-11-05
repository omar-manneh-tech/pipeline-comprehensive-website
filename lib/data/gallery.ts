/**
 * Gallery Data
 * Centralized data for gallery photos
 */

export type GalleryCategory = "all" | "events" | "sports" | "academics" | "culture" | "graduation";

export interface GalleryPhoto {
  id: string;
  title: string;
  description: string;
  image: string;
  category: GalleryCategory;
}

export const galleryPhotos: GalleryPhoto[] = [
  // Graduation
  {
    id: "1",
    title: "Graduation Ceremony 2024",
    description: "Celebrating our outstanding graduates as they embark on their next journey",
    image: "/images/gallery/graduation_day.png",
    category: "graduation",
  },
  {
    id: "2",
    title: "WASSCE Success Celebration",
    description: "Students celebrate their excellent WASSCE results",
    image: "/images/gallery/graduation_day.png",
    category: "graduation",
  },

  // Sports
  {
    id: "3",
    title: "Annual Sports Day",
    description: "Students compete in various athletic events showcasing teamwork and sportsmanship",
    image: "/images/gallery/sport_day.png",
    category: "sports",
  },
  {
    id: "4",
    title: "Championship Victory",
    description: "Our school team celebrates a regional championship win",
    image: "/images/gallery/sport_day.png",
    category: "sports",
  },

  // Academics
  {
    id: "5",
    title: "Science Fair Exhibition",
    description: "Students showcase innovative science projects and experiments",
    image: "/images/gallery/science_fair_day.png",
    category: "academics",
  },
  {
    id: "6",
    title: "Laboratory Learning",
    description: "Hands-on learning in our state-of-the-art science laboratory",
    image: "/images/academics/science_lab.png",
    category: "academics",
  },
  {
    id: "7",
    title: "Academic Excellence Awards",
    description: "Recognizing students who excelled in their academic pursuits",
    image: "/images/gallery/graduation_day.png",
    category: "academics",
  },

  // Culture
  {
    id: "8",
    title: "Cultural Day Celebration",
    description: "Embracing diversity through traditional performances and cultural displays",
    image: "/images/gallery/cultural_day.png",
    category: "culture",
  },
  {
    id: "9",
    title: "Traditional Dance Performance",
    description: "Students perform traditional dances celebrating our rich heritage",
    image: "/images/gallery/cultural_day.png",
    category: "culture",
  },

  // Events
  {
    id: "10",
    title: "Opening Assembly",
    description: "Beginning of academic year with motivational speeches and announcements",
    image: "/images/about/morning_assembly.png",
    category: "events",
  },
  {
    id: "11",
    title: "Parent-Teacher Conference",
    description: "Collaborative meeting between parents and teachers for student success",
    image: "/images/about/school_building.png",
    category: "events",
  },
  {
    id: "12",
    title: "Career Guidance Seminar",
    description: "University representatives guide students on future career paths",
    image: "/images/gallery/science_fair_day.png",
    category: "events",
  },
];

