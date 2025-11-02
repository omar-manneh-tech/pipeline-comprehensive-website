import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LicenseProvider } from "@/components/LicenseProvider";
import { LicenseBanner } from "@/components/LicenseBanner";
import { WebVitals } from "@/app/components/WebVitals";
import { SkipLink } from "@/components/SkipLink";
import { siteConfig } from "@/config/site";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName} Comprehensive School`,
  },
  description: siteConfig.description,
  keywords: [
    "school",
    "education",
    "academics",
    "learning",
    "students",
    "teachers",
    "The Gambia",
    "Banjul",
  ],
  authors: [{ name: "Sumano Tech Solutions" }],
  creator: "Sumano Tech Solutions",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.links.address,
      addressCountry: "GM",
      addressLocality: "Banjul",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.links.phone,
      email: siteConfig.links.email,
      contactType: "General Inquiries",
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.twitter,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
    ].filter(Boolean),
  };

  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <WebVitals />
        <SkipLink />
        <LicenseProvider>
          <LicenseBanner />
        </LicenseProvider>
        <Navbar />
        <main id="main-content" className="min-h-screen" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
