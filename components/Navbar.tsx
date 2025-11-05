"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Academics",
    href: "/academics",
    submenu: [
      { label: "Science Program", href: "/academics/science" },
      { label: "Commerce Program", href: "/academics/commerce" },
      { label: "Arts Program", href: "/academics/arts" },
    ],
  },
  {
    label: "Campus Life",
    href: "/campus-life", // Main campus life page
    submenu: [
      { label: "Campus Life Overview", href: "/campus-life" },
      { label: "Staff", href: "/staff" },
      { label: "Library", href: "/library" },
      { label: "Gallery", href: "/gallery" },
      { label: "News & Events", href: "/news" },
    ],
  },
  {
    label: "Admissions",
    href: "/admissions",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);

  const isActive = (href: string, submenu?: Array<{ href: string }>) => {
    if (href === "/") {
      return pathname === "/";
    }
    
    // Check if current path matches the main href
    if (pathname.startsWith(href)) {
      return true;
    }
    
    // Check if current path matches any submenu item
    if (submenu) {
      return submenu.some((item) => pathname.startsWith(item.href));
    }
    
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3" aria-label="Daddy Jobe Comprehensive School Homepage">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden"
            >
              <Image
                src={siteConfig.logo}
                alt={`${siteConfig.name} Logo`}
                fill
                className="object-cover"
                sizes="40px"
                priority
              />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl md:text-2xl font-bold text-navy">
                {siteConfig.shortName}
              </span>
              <span className="text-xs md:text-sm text-gray-600 font-medium">
                Comprehensive School
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    isActive(link.href, link.submenu)
                      ? "text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                  onMouseEnter={() => link.submenu && setOpenSubmenu(link.label)}
                  onMouseLeave={() => setOpenSubmenu(null)}
                >
                  {link.label}
                  {link.submenu && (
                    <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  )}
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {link.submenu && openSubmenu === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border py-2"
                      onMouseEnter={() => setOpenSubmenu(link.label)}
                      onMouseLeave={() => setOpenSubmenu(null)}
                    >
                      {link.submenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Portal Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              className="hidden md:flex"
            >
              <Link href="/portal">
                Portal Login
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t py-4 space-y-2"
            >
              {navLinks.map((link) => (
                <div key={link.href}>
                  {link.submenu ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileSubmenuOpen(
                            mobileSubmenuOpen === link.label ? null : link.label
                          );
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive(link.href, link.submenu)
                            ? "text-primary bg-primary/10 border-l-2 border-primary"
                            : "text-gray-700 hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            mobileSubmenuOpen === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenuOpen === link.label && (
                        <div className="pl-6 mt-1 space-y-1">
                          {link.submenu.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                                pathname.startsWith(item.href)
                                  ? "text-primary bg-primary/10 border-l-2 border-primary"
                                  : "text-gray-600 hover:bg-accent hover:text-accent-foreground"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(link.href, link.submenu)
                          ? "text-primary bg-primary/10 border-l-2 border-primary"
                          : "text-gray-700 hover:bg-accent hover:text-accent-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/portal">
                    Portal Login
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

