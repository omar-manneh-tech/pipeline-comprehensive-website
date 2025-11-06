/**
 * Search Button Component
 * Button that opens the search modal
 * Positioned in navbar with text label for clarity
 */

"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="relative bg-primary hover:bg-gold text-white border-2 border-gold hover:border-gold transition-colors flex items-center gap-2 px-4 py-2"
      aria-label="Search"
    >
      <Search className="h-5 w-5" />
      <span className="hidden md:inline font-medium">Search</span>
    </Button>
  );
}

