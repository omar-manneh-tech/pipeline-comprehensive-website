"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { SearchButton } from "@/components/Search/SearchButton";
import { SearchModal } from "@/components/Search/SearchModal";

interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  parentId?: string;
  icon?: string;
  target: string;
  children?: NavItem[];
}

interface NavLink {
  label: string;
  href: string;
  submenu?: Array<{ label: string; href: string }>;
  target?: string;
  visible?: boolean;
}

// Fallback navigation links (used if API fails)
const fallbackNavLinks: NavLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
    submenu: [
      { label: "About Us", href: "/about" },
      { label: "Campus Life", href: "/campus-life" },
      { label: "Staff", href: "/staff" },
      { label: "Library", href: "/library" },
      { label: "Gallery", href: "/gallery" },
      { label: "News & Events", href: "/news" },
    ],
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
    label: "Admissions",
    href: "/admissions",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Portal",
    href: "/portal",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>(fallbackNavLinks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch navigation from CMS API
    const fetchNavigation = async () => {
      try {
        const response = await fetch("/api/site/nav");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Transform API data to component format
            const topLevelItems = data.data.filter((item: NavItem) => !item.parentId);
            const transformedLinks: NavLink[] = topLevelItems
              .sort((a: NavItem, b: NavItem) => a.order - b.order)
              .filter((item: NavItem) => item.visible !== false)
              .map((item: NavItem) => {
                const children = data.data
                  .filter((child: NavItem) => child.parentId === item.id && child.visible !== false)
                  .sort((a: NavItem, b: NavItem) => a.order - b.order)
                  .map((child: NavItem) => ({
                    label: child.label,
                    href: child.href,
                  }));

                return {
                  label: item.label,
                  href: item.href,
                  submenu: children.length > 0 ? children : undefined,
                  target: item.target,
                  visible: item.visible,
                };
              });

            if (transformedLinks.length > 0) {
              setNavLinks(transformedLinks);
            }
          }
        }
      } catch (error) {
        console.error("[Navbar] Failed to fetch navigation:", error);
        // Keep fallback navigation
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, []);

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
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 sm:h-18 md:h-20 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0" aria-label="Daddy Jobe Comprehensive School Homepage">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 flex-shrink-0 rounded-full overflow-hidden bg-white border-2 border-gold shadow-lg p-1.5 sm:p-2"
            >
              <Image
                src={siteConfig.logo}
                alt={`${siteConfig.name} Logo`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                priority
              />
            </motion.div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-navy truncate">
                {siteConfig.shortName}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium truncate">
                Comprehensive School
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!loading && (
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks
                .filter((link) => link.href !== "/portal")
                .map((link) => (
                  <div key={link.href} className="relative group">
                    <Link
                      href={link.href}
                      target={link.target || "_self"}
                      className={`px-2 md:px-3 lg:px-4 py-2 text-xs md:text-sm font-medium transition-colors relative whitespace-nowrap ${
                        isActive(link.href, link.submenu)
                          ? "text-primary after:absolute after:bottom-0 after:left-2 md:after:left-3 lg:after:left-4 after:right-2 md:after:right-3 lg:after:right-4 after:h-0.5 after:bg-primary"
                          : "text-gray-700 hover:text-primary"
                      }`}
                      onMouseEnter={() => link.submenu && setOpenSubmenu(link.label)}
                      onMouseLeave={() => setOpenSubmenu(null)}
                    >
                      {link.label}
                      {link.submenu && (
                        <ChevronDown className="inline-block ml-0.5 md:ml-1 h-3 w-3 md:h-4 md:w-4" />
                      )}
                    </Link>

                    {/* Desktop Dropdown */}
                    {link.submenu && (
                      <AnimatePresence>
                        {openSubmenu === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                            onMouseEnter={() => setOpenSubmenu(link.label)}
                            onMouseLeave={() => setOpenSubmenu(null)}
                          >
                            {link.submenu.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              
              {/* Portal Button */}
              {navLinks.find((link) => link.href === "/portal") && (
                <Button
                  asChild
                  className="bg-primary hover:bg-gold text-white border-2 border-gold hover:border-gold transition-colors"
                >
                  <Link href="/portal">Portal</Link>
                </Button>
              )}
            </div>
          )}

          {/* Search & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <SearchButton onClick={() => setSearchOpen(true)} />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t"
            >
              <div className="py-4 space-y-2">
                {!loading &&
                  navLinks
                    .filter((link) => link.href !== "/portal")
                    .map((link) => (
                      <div key={link.href}>
                        <div className="flex items-center justify-between">
                          <Link
                            href={link.href}
                            target={link.target || "_self"}
                            className={`block px-4 py-2 text-sm font-medium ${
                              isActive(link.href, link.submenu)
                                ? "text-primary"
                                : "text-gray-700"
                            }`}
                            onClick={() => {
                              if (!link.submenu) {
                                setMobileMenuOpen(false);
                              }
                            }}
                          >
                            {link.label}
                          </Link>
                          {link.submenu && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                setMobileSubmenuOpen(
                                  mobileSubmenuOpen === link.label ? null : link.label
                                )
                              }
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  mobileSubmenuOpen === link.label ? "rotate-180" : ""
                                }`}
                              />
                            </Button>
                          )}
                        </div>
                        {link.submenu && (
                          <AnimatePresence>
                            {mobileSubmenuOpen === link.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-8 py-2 space-y-1">
                                  {link.submenu.map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className="block px-4 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    ))}
                
                {/* Portal Button (Mobile) */}
                {navLinks.find((link) => link.href === "/portal") && (
                  <div className="px-4 py-2">
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-gold text-white border-2 border-gold hover:border-gold transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/portal">Portal</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
