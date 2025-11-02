/**
 * Contact Page
 * Contact form and information for reaching Daddy Jobe Comprehensive School
 */

import { HeroBanner } from "@/components/Contact/HeroBanner";
import { ContactForm } from "@/components/Contact/ContactForm";
import { ContactInfo } from "@/components/Contact/ContactInfo";
import { LocationMap } from "@/components/Contact/LocationMap";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Daddy Jobe Comprehensive School. We're here to answer your questions and help you learn more about our programs.",
};

// ISR: Revalidate every hour
export const revalidate = 3600;

export default function ContactPage() {
  return (
    <>
      <HeroBanner />
      <ContactForm />
      <ContactInfo />
      <LocationMap />
    </>
  );
}

