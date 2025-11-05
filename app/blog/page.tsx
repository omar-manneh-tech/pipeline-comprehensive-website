/**
 * Blog Page
 * Main blog page with search, categories, and pagination
 */

"use client";

import { useState, useMemo } from "react";
import { HeroBanner } from "@/components/Blog/HeroBanner";
import { BlogList } from "@/components/Blog/BlogList";
import { CategoryFilter } from "@/components/Blog/CategoryFilter";
import { BlogSearch } from "@/components/Blog/BlogSearch";
import { Pagination } from "@/components/Blog/Pagination";
import { getAllPosts, getPostsByCategory, searchPosts, BlogCategory } from "@/lib/data/blog";
import { BlogPost } from "@/lib/data/blog";

const POSTS_PER_PAGE = 9;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on category and search
  const filteredPosts = useMemo(() => {
    let posts: BlogPost[];

    if (searchQuery.trim()) {
      posts = searchPosts(searchQuery);
    } else {
      posts = getPostsByCategory(selectedCategory);
    }

    return posts;
  }, [selectedCategory, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: BlogCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSearchQuery(""); // Clear search when category changes
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedCategory("All"); // Reset category when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <HeroBanner />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Search */}
            <BlogSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />

            {/* Category Filter */}
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

            {/* Results Count */}
            {filteredPosts.length > 0 && (
              <div className="mb-8 text-center text-gray-600">
                <p className="text-lg">
                  Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
            )}

            {/* Blog List */}
            <BlogList posts={paginatedPosts} />

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>
      </section>
    </>
  );
}

