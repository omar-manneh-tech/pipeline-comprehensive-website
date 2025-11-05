/**
 * Search Modal Component
 * Provides a search interface with modal overlay
 * Includes search input, autocomplete, and results display
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, FileText, BookOpen, Users, GraduationCap, Calendar, Image as ImageIcon, Mail } from "lucide-react";
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
  page: { icon: FileText, label: "Page" },
  content: { icon: BookOpen, label: "Content" },
  program: { icon: GraduationCap, label: "Program" },
  section: { icon: FileText, label: "Section" },
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
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

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

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

  const handleResultClick = () => {
    onClose();
    setQuery("");
    setResults([]);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={transitions.default}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 z-50"
          >
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages, content, programs..."
                  className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-base"
                />
                {isLoading && (
                  <Loader2 className="h-5 w-5 text-gray-400 animate-spin flex-shrink-0" />
                )}
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {error && (
                  <div className="px-4 py-8 text-center text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {!error && query && !isLoading && results.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No results found for &quot;{query}&quot;
                  </div>
                )}

                {!error && !query && (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    Start typing to search...
                  </div>
                )}

                {results.length > 0 && (
                  <div className="py-2">
                    {results.map((result) => {
                      const Icon = searchTypes[result.type]?.icon || FileText;
                      return (
                        <Link
                          key={result.id}
                          href={result.url}
                          onClick={handleResultClick}
                          className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 mt-0.5">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">
                                  {result.title}
                                </h3>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                                  {searchTypes[result.type]?.label || result.type}
                                </span>
                              </div>
                              {result.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {result.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {result.url}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Press ESC to close</span>
                  <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

