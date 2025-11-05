/**
 * Blog Search Component
 * Search functionality for blog posts
 */

"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

interface BlogSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BlogSearch({ searchQuery, onSearchChange }: BlogSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const debouncedSearch = useDebounce((value: string) => {
    onSearchChange(value);
  }, 300);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleClear = () => {
    setLocalQuery("");
    onSearchChange("");
  };

  return (
    <div className="relative mb-8 max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search blog posts by title, content, or tags..."
          value={localQuery}
          onChange={handleChange}
          className="pl-12 pr-12 py-6 text-lg border-2 border-gray-200 focus:border-primary rounded-full"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

