/**
 * Home Page Data
 * Centralized data layer for homepage content
 */

export interface Event {
  title: string;
  description: string;
  image: string;
}

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  text: string;
}

export interface Activity {
  title: string;
  description: string;
  image: string;
}

export interface CoreValue {
  title: string;
  description: string;
  iconName: "ShieldCheck" | "Handshake" | "Trophy";
}

/**
 * School Events & Achievements
 */
export const schoolEvents: Event[] = [
  {
    title: "Science Fair 2024",
    description: "Celebrating innovation and creativity in science and technology",
    image: "/images/gallery/science_fair.jpg",
  },
  {
    title: "Graduation Ceremony",
    description: "Honoring our outstanding graduates and their achievements",
    image: "/images/gallery/graduation_day.jpg",
  },
  {
    title: "Sports Day Champions",
    description: "Celebrating teamwork, sportsmanship, and excellence in athletics",
    image: "/images/gallery/sports_day.jpg",
  },
  {
    title: "Cultural Festival",
    description: "Showcasing the rich diversity and talent of our student community",
    image: "/images/gallery/cultural_day.jpg",
  },
];

/**
 * Testimonials
 */
export const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Parent",
    image: "/images/misc/placeholder_profile.jpg",
    text: "Daddy Jobe Comprehensive School has provided an exceptional learning environment for my child. The teachers are dedicated, and the curriculum is comprehensive.",
  },
  {
    name: "Michael Chen",
    role: "Alumni",
    image: "/images/misc/placeholder_profile.jpg",
    text: "The foundation I received here prepared me for success in university and beyond. I'm grateful for the excellent education and support.",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Parent & Educator",
    image: "/images/misc/placeholder_profile.jpg",
    text: "As an educator myself, I can see the quality of instruction and care at Daddy Jobe. It's a place where students truly thrive.",
  },
  {
    name: "David Thompson",
    role: "Student",
    image: "/images/misc/placeholder_profile.jpg",
    text: "I love coming to school every day! The teachers make learning fun, and I've made so many friends. This school is amazing!",
  },
  {
    name: "Amina Diallo",
    role: "Parent",
    image: "/images/misc/placeholder_profile.jpg",
    text: "The supportive community and excellent academic programs make this the best choice for our children's education.",
  },
];

/**
 * Student Life Activities
 */
export const studentActivities: Activity[] = [
  {
    title: "Sports & Athletics",
    description: "Competitive sports and physical excellence",
    image: "/images/gallery/sports_day.jpg",
  },
  {
    title: "Science Fair",
    description: "Innovation and scientific discovery",
    image: "/images/gallery/science_fair.jpg",
  },
  {
    title: "Cultural Celebrations",
    description: "Embracing diversity and tradition",
    image: "/images/gallery/cultural_day.jpg",
  },
  {
    title: "Debate & Leadership",
    description: "Critical thinking and public speaking",
    image: "/images/gallery/graduation_day.jpg",
  },
];

/**
 * Core Values
 */
export const coreValues: CoreValue[] = [
  {
    title: "Discipline",
    description:
      "Discipline is the foundation of success. We instill focus, respect, and a strong sense of responsibility — values that prepare students for life's challenges inside and outside the classroom.",
    iconName: "ShieldCheck",
  },
  {
    title: "Integrity",
    description:
      "Integrity is our compass. Every student learns the importance of honesty, fairness, and doing what's right — even when no one is watching.",
    iconName: "Handshake",
  },
  {
    title: "Excellence",
    description:
      "Excellence drives everything we do. From academics to character development, we inspire our students to reach their full potential through dedication and a love for learning.",
    iconName: "Trophy",
  },
];

