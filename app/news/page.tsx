/**
 * News & Events Page
 * Latest news, announcements, and upcoming events
 */

import { HeroBanner } from "@/components/News/HeroBanner";
import { LatestNews } from "@/components/News/LatestNews";
import { UpcomingEvents } from "@/components/News/UpcomingEvents";
import { NewsCategories } from "@/components/News/NewsCategories";

export const metadata = {
  title: "News & Events",
  description: "Stay updated with the latest news, announcements, and upcoming events at Daddy Jobe Comprehensive School.",
};

export default function NewsPage() {
  return (
    <>
      <HeroBanner />
      <LatestNews />
      <UpcomingEvents />
      <NewsCategories />
    </>
  );
}

