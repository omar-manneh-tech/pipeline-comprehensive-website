/**
 * Professional Search Modal Component
 * Enterprise-grade search interface with advanced features
 * Includes search input, autocomplete, categories, and results display
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  Loader2, 
  FileText, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Calendar, 
  Image as ImageIcon, 
  Mail,
  Building2,
  Sparkles,
  Clock,
  TrendingUp,
  ArrowRight,
  Command
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/services/api/client";
import { transitions } from "@/lib/animations/constants";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "page" | "content" | "program" | "section";
  icon?: React.ReactNode;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const searchTypes = {
  page: { icon: FileText, label: "Page", color: "text-blue-600 bg-blue-50" },
  content: { icon: BookOpen, label: "Content", color: "text-purple-600 bg-purple-50" },
  program: { icon: GraduationCap, label: "Program", color: "text-green-600 bg-green-50" },
  section: { icon: FileText, label: "Section", color: "text-orange-600 bg-orange-50" },
};

const quickCategories = [
  { icon: GraduationCap, label: "Academics", href: "/academics", color: "bg-primary text-white" },
  { icon: Building2, label: "About", href: "/about", color: "bg-gold text-white" },
  { icon: Users, label: "Staff", href: "/staff", color: "bg-blue-600 text-white" },
  { icon: BookOpen, label: "Library", href: "/library", color: "bg-purple-600 text-white" },
  { icon: Calendar, label: "Events", href: "/news", color: "bg-green-600 text-white" },
  { icon: Mail, label: "Contact", href: "/contact", color: "bg-orange-600 text-white" },
];

const popularSearches = [
  "WASSCE Preparation",
  "Admission Requirements",
  "Science Program",
  "Library Resources",
  "Staff Directory",
  "Calendar Events",
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        handleResultClick(results[selectedIndex].url);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, selectedIndex, results]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      setSelectedIndex(-1);

      try {
        const response = await apiClient.post<{ success: boolean; results: SearchResult[]; count: number }>("/search", {
          query: query.trim(),
        });

        if (response.success && response.results) {
          setResults(response.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search. Please try again.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleResultClick = (url: string) => {
    // Save to recent searches
    if (query.trim()) {
      const updated = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
    
    onClose();
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    
    // Navigate if URL is provided
    if (url) {
      window.location.href = url;
    }
  };

  const handleQuickCategoryClick = (href: string) => {
    onClose();
    window.location.href = href;
  };

  const handlePopularSearch = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.default}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={transitions.default}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl mx-4 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-gold/20 overflow-hidden">
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search anything... (pages, programs, content, events)"
                      className="w-full bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 text-base border-2 border-white/50 focus:border-gold focus:outline-none transition-all"
                    />
                    {isLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Close search"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="max-h-[70vh] overflow-y-auto" ref={resultsRef}>
                {/* Quick Categories */}
                {!query && (
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-gray-700">Quick Access</h3>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {quickCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <motion.button
                            key={category.href}
                            onClick={() => handleQuickCategoryClick(category.href)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`${category.color} p-3 rounded-xl flex flex-col items-center gap-2 hover:shadow-lg transition-all group`}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-xs font-medium">{category.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                {!query && popularSearches.length > 0 && (
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-gray-700">Popular Searches</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handlePopularSearch(search)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 rounded-full text-sm transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {!query && recentSearches.length > 0 && (
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-gray-700">Recent Searches</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleRecentSearch(search)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 rounded-full text-sm transition-colors flex items-center gap-2"
                        >
                          <Clock className="h-3 w-3" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results */}
                {error && (
                  <div className="px-6 py-12 text-center">
                    <div className="text-red-600 mb-2">⚠️</div>
                    <p className="text-red-600 font-medium">{error}</p>
                    <p className="text-sm text-gray-500 mt-1">Please try again</p>
                  </div>
                )}

                {!error && query && !isLoading && results.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-gray-700 font-medium mb-1">No results found</p>
                    <p className="text-sm text-gray-500">
                      Try searching for &quot;<span className="font-semibold">{query}</span>&quot; with different keywords
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="py-4">
                    {results.map((result, index) => {
                      const Icon = searchTypes[result.type]?.icon || FileText;
                      const typeInfo = searchTypes[result.type] || { color: "text-gray-600 bg-gray-50" };
                      const isSelected = index === selectedIndex;

                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={result.url}
                            onClick={() => handleResultClick(result.url)}
                            className={`block px-6 py-4 transition-all border-l-4 group ${
                              isSelected
                                ? "bg-primary/5 border-primary shadow-sm"
                                : "hover:bg-gray-50 border-transparent hover:border-gold/50"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-3 ${typeInfo.color.split(" ")[1]} rounded-xl flex-shrink-0`}>
                                <Icon className={`h-5 w-5 ${typeInfo.color.split(" ")[0]}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <h3 className="font-semibold text-gray-900 text-base group-hover:text-primary transition-colors">
                                    {result.title}
                                  </h3>
                                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${typeInfo.color}`}>
                                    {searchTypes[result.type]?.label || result.type}
                                  </span>
                                </div>
                                {result.description && (
                                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                    {result.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-gray-400 truncate flex-1">
                                    {result.url}
                                  </p>
                                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">
                        <Command className="inline h-3 w-3" />
                      </kbd>
                      <span>+</span>
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">K</kbd>
                      <span className="ml-1">to open</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">↑</kbd>
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">↓</kbd>
                      <span>to navigate</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">Esc</kbd>
                    <span>to close</span>
                    {results.length > 0 && (
                      <span className="font-semibold text-primary">
                        {results.length} result{results.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
