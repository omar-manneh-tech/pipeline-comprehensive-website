/**
 * Footer Search Component
 * Beautiful search interface for the footer section
 * Inline search with results dropdown
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, FileText, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/services/api/client";
import { transitions } from "@/lib/animations/constants";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "page" | "content" | "program" | "section";
}

const searchTypes = {
  page: { icon: FileText, label: "Page" },
  content: { icon: BookOpen, label: "Content" },
  program: { icon: GraduationCap, label: "Program" },
  section: { icon: FileText, label: "Section" },
};

export function FooterSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResults]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await apiClient.post<{ success: boolean; results: SearchResult[]; count: number }>("/search", {
          query: query.trim(),
        });

        if (response.success && response.results) {
          setResults(response.results);
          setShowResults(response.results.length > 0);
        } else {
          setResults([]);
          setShowResults(false);
        }
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    setIsFocused(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg mb-4">Search Our Website</h3>
        
        {/* Search Input */}
        <div className="relative">
          <div
            className={`relative flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 rounded-lg px-4 py-3 transition-all duration-300 ${
              isFocused
                ? "border-gold shadow-lg shadow-gold/20 bg-white/15"
                : "border-white/20 hover:border-white/30"
            }`}
          >
            <Search className={`h-5 w-5 flex-shrink-0 transition-colors ${isFocused ? "text-gold" : "text-gray-300"}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                if (results.length > 0) {
                  setShowResults(true);
                }
              }}
              onBlur={() => {
                // Keep results visible briefly on blur
                setTimeout(() => setIsFocused(false), 200);
              }}
              placeholder="Search pages, programs, content..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-300 text-sm"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setShowResults(false);
                }}
                className="p-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-300 hover:text-white" />
              </button>
            )}
            {isLoading && (
              <Loader2 className="h-4 w-4 text-gold animate-spin flex-shrink-0" />
            )}
          </div>

          {/* Results Dropdown */}
          <AnimatePresence>
            {showResults && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={transitions.default}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
              >
                <div className="py-2">
                  {results.map((result) => {
                    const Icon = searchTypes[result.type]?.icon || FileText;
                    return (
                      <Link
                        key={result.id}
                        href={result.url}
                        onClick={handleResultClick}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">
                                {result.title}
                              </h4>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                                {searchTypes[result.type]?.label || result.type}
                              </span>
                            </div>
                            {result.description && (
                              <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                                {result.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 truncate">
                              {result.url}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                
                {/* Footer */}
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Results */}
          <AnimatePresence>
            {showResults && query && !isLoading && results.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={transitions.default}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
              >
                <p className="text-sm text-gray-600 text-center">
                  No results found for &quot;{query}&quot;
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Tips */}
        <p className="text-xs text-gray-400 italic">
          Try searching for: Academics, Programs, Library, Admissions...
        </p>
      </div>
    </div>
  );
}

