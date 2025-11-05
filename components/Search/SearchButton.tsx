/**
 * Search Button Component
 * Button that opens the search modal
 * Positioned in navbar
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
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="relative"
      aria-label="Search"
    >
      <Search className="h-5 w-5" />
    </Button>
  );
}

