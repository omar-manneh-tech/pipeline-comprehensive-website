"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { FooterSearch } from "@/components/Search/FooterSearch";

interface FooterSection {
  id: string;
  title: string;
  type: string;
  links: FooterLink[];
}

interface FooterLink {
  id: string;
  label: string;
  href: string;
}

// Fallback footer links (used if API fails)
const fallbackFooterLinks = {
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "Academics", href: "/academics" },
    { label: "Admissions", href: "/admissions" },
    { label: "Campus Life", href: "/campus-life" },
    { label: "Staff", href: "/staff" },
    { label: "Library", href: "/library" },
    { label: "News & Events", href: "/news" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  programs: [
    { label: "Science Program", href: "/academics/science" },
    { label: "Commerce Program", href: "/academics/commerce" },
    { label: "Arts Program", href: "/academics/arts" },
    { label: "WASSCE Preparation", href: "/academics" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch footer from CMS API
    const fetchFooter = async () => {
      try {
        const response = await fetch("/api/site/footer");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setFooterSections(data.data);
          }
        }
      } catch (error) {
        console.error("[Footer] Failed to fetch footer:", error);
        // Keep fallback footer
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, []);

  // Get sections by type
  const getSectionByType = (type: string) => {
    return footerSections.find((section) => section.type === type);
  };

  const quickLinksSection = getSectionByType("quick_links");
  const programsSection = getSectionByType("programs");

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-7 md:gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden bg-white border-2 border-gold shadow-lg p-2"
              >
                <Image
                  src={siteConfig.logo}
                  alt={`${siteConfig.name} Logo`}
                  fill
                  className="object-contain"
                  sizes="80px"
                  priority
                />
              </motion.div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-white group-hover:text-gold transition-colors">
                  {siteConfig.shortName}
                </span>
                <span className="text-xs text-gray-300 font-medium">
                  Comprehensive School
                </span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm">{siteConfig.description}</p>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gold transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {quickLinksSection?.title || "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {!loading && quickLinksSection
                ? quickLinksSection.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-gold transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))
                : fallbackFooterLinks.quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-gold transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {programsSection?.title || "Programs"}
            </h3>
            <ul className="space-y-2">
              {!loading && programsSection
                ? programsSection.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-gold transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))
                : fallbackFooterLinks.programs.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-gold transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Search Section */}
          <div>
            <FooterSearch />
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span>{siteConfig.links.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="hover:text-gold transition-colors"
                >
                  {siteConfig.links.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                <a
                  href={`tel:${siteConfig.links.phone}`}
                  className="hover:text-gold transition-colors"
                >
                  {siteConfig.links.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved. | Powered by{" "}
            <span className="text-gold">Sumano Tech Solutions</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
