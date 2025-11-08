"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllPosts, type BlogCategory, type BlogPost } from "@/lib/data/blog";
import { CalendarDays, Search, User } from "lucide-react";

type BlogFilter = BlogCategory;

const tabOrder: BlogFilter[] = [
  "All",
  "Educational Articles",
  "Student Stories",
  "Study Tips",
  "Career Guidance",
  "School Updates",
  "Achievements",
  "Parent Resources",
];

const sidebarTags = [
  "Academic Excellence",
  "STEM Labs",
  "Student Success",
  "Scholarships",
  "Career Pathways",
  "Leadership",
  "Parent Resources",
  "Campus Life",
  "Digital Literacy",
  "Lab Safety",
  "Research Skills",
  "Innovation Labs",
];

function paginateContent(html: string, chunkSize = 1400): string[] {
  if (!html) return [];
  const segments = html.split(/(?=<h2|<h3|<p|<ul|<ol|<blockquote)/g).filter(Boolean);
  const pages: string[] = [];
  let buffer: string[] = [];
  let length = 0;

  segments.forEach((segment) => {
    const textLength = segment.replace(/<[^>]+>/g, "").trim().length;
    if (length + textLength > chunkSize && buffer.length > 0) {
      pages.push(buffer.join(""));
      buffer = [];
      length = 0;
    }
    buffer.push(segment);
    length += textLength;
  });

  if (buffer.length) {
    pages.push(buffer.join(""));
  }

  return pages.length ? pages : [html];
}

export function BlogExplorerSection() {
  const allPosts = useMemo(() => getAllPosts(), []);
  const [activeTab, setActiveTab] = useState<BlogFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePost, setActivePost] = useState<BlogPost | undefined>(allPosts[0]);
  const [showContent, setShowContent] = useState(false);
  const [contentPage, setContentPage] = useState(0);
  const [cardPage, setCardPage] = useState(0);
  const [tagPage, setTagPage] = useState(0);
  const [recentPage, setRecentPage] = useState(0);
  const [tabPage, setTabPage] = useState(0);
  const CARDS_PER_PAGE = 6;
  const TABS_PER_PAGE = 6;
  const TAGS_PER_PAGE = 8;
  const RECENT_PER_PAGE = 4;

  const categoryCounts = useMemo(() => {
    const counts: Record<BlogFilter, number> = {
      All: allPosts.length,
      "Educational Articles": 0,
      "Student Stories": 0,
      "Study Tips": 0,
      "Career Guidance": 0,
      "School Updates": 0,
      Achievements: 0,
      "Parent Resources": 0,
    };

    allPosts.forEach((post) => {
      const category = post.category as BlogFilter;
      if (counts[category] !== undefined) {
        counts[category] += 1;
      }
    });

    return counts;
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let posts =
      activeTab === "All"
        ? allPosts
        : allPosts.filter((post) => post.category === activeTab);

    if (query) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return posts;
  }, [allPosts, activeTab, searchQuery]);

  useEffect(() => {
    if (filteredPosts.length === 0) {
      setActivePost(undefined);
      setShowContent(false);
      setContentPage(0);
      setCardPage(0);
      return;
    }
    setActivePost((current) => {
      if (current && filteredPosts.some((post) => post.id === current.id)) {
        return current;
      }
      return filteredPosts[0];
    });
  }, [filteredPosts]);

  const recentPosts = useMemo(() => allPosts.slice(0, 5), [allPosts]);

  const contentPages = useMemo(
    () => paginateContent(activePost?.content ?? "", 1400),
    [activePost?.id]
  );

  const handleTabChange = useCallback((tab: BlogFilter) => {
    setActiveTab(tab);
    setSearchQuery("");
    setShowContent(false);
    setContentPage(0);
    setCardPage(0);
  }, []);

  const handleSelectPost = useCallback((post: BlogPost) => {
    setActivePost(post);
    setShowContent(true);
    setContentPage(0);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setShowContent(false);
    setContentPage(0);
    setCardPage(0);
  }, []);

  const handleBackToGrid = useCallback(() => {
    setShowContent(false);
    setContentPage(0);
  }, []);

  useEffect(() => {
    setContentPage(0);
  }, [contentPages.length]);

  const totalCardPages = useMemo(
    () => Math.ceil(filteredPosts.length / CARDS_PER_PAGE) || 1,
    [filteredPosts.length, CARDS_PER_PAGE]
  );

  const paginatedCards = useMemo(() => {
    const start = cardPage * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;
    return filteredPosts.slice(start, end);
  }, [filteredPosts, cardPage, CARDS_PER_PAGE]);

  useEffect(() => {
    if (cardPage > totalCardPages - 1) {
      setCardPage(Math.max(0, totalCardPages - 1));
    }
  }, [cardPage, totalCardPages]);

  const tabPages = useMemo(() => Math.ceil(tabOrder.length / TABS_PER_PAGE), []);
  const paginatedTabs = useMemo(() => {
    const start = tabPage * TABS_PER_PAGE;
    return tabOrder.slice(start, start + TABS_PER_PAGE);
  }, [tabPage]);

  const tagPages = useMemo(
    () => Math.ceil(sidebarTags.length / TAGS_PER_PAGE),
    []
  );
  const paginatedTags = useMemo(() => {
    const start = tagPage * TAGS_PER_PAGE;
    return sidebarTags.slice(start, start + TAGS_PER_PAGE);
  }, [tagPage]);

  const paginatedRecentPosts = useMemo(() => {
    const start = recentPage * RECENT_PER_PAGE;
    return recentPosts.slice(start, start + RECENT_PER_PAGE);
  }, [recentPosts, recentPage]);

  useEffect(() => {
    if (tabPage > tabPages - 1) {
      setTabPage(Math.max(0, tabPages - 1));
    }
  }, [tabPage, tabPages]);

  useEffect(() => {
    if (tagPage > tagPages - 1) {
      setTagPage(Math.max(0, tagPages - 1));
    }
  }, [tagPage, tagPages]);

  useEffect(() => {
    const recentPages = Math.ceil(recentPosts.length / RECENT_PER_PAGE) || 1;
    if (recentPage > recentPages - 1) {
      setRecentPage(Math.max(0, recentPages - 1));
    }
  }, [recentPosts.length, recentPage]);

  return (
    <section className="py-20 bg-gradient-to-br from-[#020b26] via-[#031132] to-[#020922]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(36,117,255,0.2),_transparent_60%)] pointer-events-none" />
      <div className="relative container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-6 text-center">
            <SectionHeader
              title="Blog Insights Explorer"
              description={
                <div className="space-y-3 text-white/80 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
                  <p>
                    Dive into curated articles, student stories, and expert guidance from Daddy Jobe
                    Comprehensive School. Filter by topic, discover highlights, and explore full
                    stories without leaving the page.
                  </p>
                  <p>
                    Use the tabs to navigate themes, search within any topic, and keep an eye on the
                    latest conversations shaping our academic community.
                  </p>
                </div>
              }
              titleClassName="text-white drop-shadow-lg"
              descriptionClassName="text-white/80 drop-shadow-md max-w-3xl mx-auto"
            />
            <Button
              asChild
              variant="outline"
              className="inline-flex items-center justify-center rounded-full border-2 border-gold bg-white/10 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-primary hover:shadow-[0_15px_35px_rgba(255,215,0,0.35)]"
            >
              <a href="#blog-explorer-section">View Explorer Section</a>
            </Button>
          </div>

          <div
            id="blog-explorer-section"
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-stretch"
          >
            <aside className="space-y-6 lg:h-full">
              <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_18px_48px_rgba(12,36,92,0.35)] px-6 py-7 space-y-7 lg:h-full lg:flex lg:flex-col sticky top-28">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
                    Filter Articles
                  </h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-white/60">
                      <Search className="h-5 w-5" />
                    </div>
                    <Input
                      value={searchQuery}
                      onChange={(event) => handleSearchChange(event.target.value)}
                      type="search"
                      placeholder="Search articles by title, content, or tags..."
                      className="h-12 rounded-full border-white/15 bg-white/15 pl-12 pr-6 text-sm text-white placeholder:text-white/60 shadow-lg shadow-black/20 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Categories
                  </span>
                  {tabPages > 1 && (
                    <div className="flex items-center gap-2 text-xs">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={tabPage === 0}
                        onClick={() => setTabPage((prev) => Math.max(0, prev - 1))}
                        className="h-7 rounded-full border-white/20 bg-white/10 px-3 text-white disabled:opacity-40"
                      >
                        &lt;
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={tabPage === tabPages - 1}
                        onClick={() =>
                          setTabPage((prev) => Math.min(tabPages - 1, prev + 1))
                        }
                        className="h-7 rounded-full border-white/20 bg-white/10 px-3 text-white disabled:opacity-40"
                      >
                        &gt;
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {paginatedTabs.map((tab) => {
                    const count = categoryCounts[tab] ?? 0;
                    const selected = tab === activeTab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => handleTabChange(tab)}
                        className={[
                          "group rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition-all duration-300",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#020b26]",
                          selected
                            ? "bg-white/25 text-white shadow-lg shadow-primary/30"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white",
                        ].join(" ")}
                      >
                        <span className="flex items-center gap-2">
                          <span>{tab}</span>
                          <span
                            className={[
                              "rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
                              selected ? "bg-white text-primary" : "bg-white/15 text-white/80",
                            ].join(" ")}
                          >
                            {count}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
                      Popular Tags
                    </h3>
                    {tagPages > 1 && (
                      <div className="flex items-center gap-2 text-xs">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={tagPage === 0}
                          onClick={() => setTagPage((prev) => Math.max(0, prev - 1))}
                          className="h-7 rounded-full border-white/20 bg-white/10 px-3 text-white disabled:opacity-40"
                        >
                          &lt;
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={tagPage === tagPages - 1}
                          onClick={() =>
                            setTagPage((prev) => Math.min(tagPages - 1, prev + 1))
                          }
                          className="h-7 rounded-full border-white/20 bg-white/10 px-3 text-white disabled:opacity-40"
                        >
                          &gt;
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {paginatedTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/75"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-4 lg:flex-1 lg:flex lg:flex-col lg:gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
                      Recent Posts
                    </h3>
                    {Math.ceil(recentPosts.length / RECENT_PER_PAGE) > 1 && (
                      <div className="flex items-center gap-2 text-xs">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={recentPage === 0}
                          onClick={() => setRecentPage((prev) => Math.max(0, prev - 1))}
                          className="h-7 rounded-full border-white/20 bg-white/10 px-3 text-white disabled:opacity-40"
                        >
                          &lt;
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            recentPage >=
                            Math.ceil(recentPosts.length / RECENT_PER_PAGE) - 1
                          }
                          onClick={() =>
                            setRecentPage((prev) =>
                              Math.min(
                                Math.ceil(recentPosts.length / RECENT_PER_PAGE) - 1,
                                prev + 1
                              )
                            )
                          }
                          className="h-7 rounded-full border-white/20 bg-white/10 px-3 text-white disabled:opacity-40"
                        >
                          &gt;
                        </Button>
                      </div>
                    )}
                  </div>
                  <ul className="space-y-4 text-sm text-white/80">
                    {paginatedRecentPosts.map((post) => (
                      <li key={post.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectPost(post)}
                          className="text-left transition-colors hover:text-gold focus:outline-none focus-visible:text-gold"
                        >
                          <span className="block font-semibold">{post.title}</span>
                          <span className="text-xs text-white/50">
                            {new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }).format(new Date(post.publishedDate))}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-[0_25px_60px_rgba(10,30,70,0.45)] flex flex-col lg:h-full">
              {activePost && (
                <>
                  <div className="absolute inset-0">
                    <Image
                      src={activePost.image}
                      alt={activePost.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#020b26]/95 via-[#031132]/85 to-[#020b26]/90" />
                  </div>
                  <div className="relative z-10 flex-1 flex flex-col p-6 sm:p-8 lg:p-10 space-y-6 text-white">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-white/70">
                        <span className="rounded-full bg-white/15 px-3 py-1">
                          {activePost.category}
                        </span>
                        <span className="flex items-center gap-2 text-white/60">
                          <User className="h-4 w-4" />
                          {activePost.author}
                        </span>
                        <span className="flex items-center gap-2 text-white/60">
                          <CalendarDays className="h-4 w-4" />
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(activePost.publishedDate))}
                        </span>
                        <span className="text-white/60">• {activePost.readTime} min read</span>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl sm:text-3xl font-semibold leading-tight drop-shadow-lg">
                          {activePost.title}
                        </h3>
                        {showContent && (
                          <Button
                            variant="outline"
                            onClick={handleBackToGrid}
                            className="rounded-full border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                          >
                            Back to Articles
                          </Button>
                        )}
                      </div>
                      {!showContent && (
                        <p className="text-white/75 max-w-3xl">{activePost.excerpt}</p>
                      )}
                    </div>

                    {!showContent && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {paginatedCards.map((post) => (
                          <button
                            key={post.id}
                            type="button"
                            onClick={() => handleSelectPost(post)}
                            className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 text-left transition-all duration-300 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#020b26]"
                          >
                            <div className="relative h-40">
                              <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#020b26]/85 via-[#020b26]/30 to-transparent" />
                              <span className="absolute top-4 left-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                {post.category}
                              </span>
                            </div>
                            <div className="space-y-3 px-5 py-6 bg-[#020b26]/80">
                              <h4 className="text-lg font-semibold leading-tight drop-shadow group-hover:text-gold transition-colors text-white">
                                {post.title}
                              </h4>
                              <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
                                {post.excerpt}
                              </p>
                            </div>
                          </button>
                          ))}
                        </div>
                        {totalCardPages > 1 && (
                          <div className="flex items-center justify-between text-sm text-white/70 pt-2">
                            <span>
                              Page {cardPage + 1} of {totalCardPages}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                disabled={cardPage === 0}
                                onClick={() => setCardPage((prev) => Math.max(0, prev - 1))}
                                className="rounded-full border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                disabled={cardPage === totalCardPages - 1}
                                onClick={() =>
                                  setCardPage((prev) =>
                                    Math.min(totalCardPages - 1, prev + 1)
                                  )
                                }
                                className="rounded-full border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {showContent && activePost && (
                      <div className="flex-1 flex flex-col space-y-6">
                        <div className="flex flex-wrap gap-2">
                          {activePost.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/75"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1">
                          <div
                            className="prose prose-invert max-w-none text-white/90 leading-relaxed [&_*]:text-white [&_h2]:mt-6 [&_h2]:text-2xl [&_h3]:text-xl [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-4"
                            dangerouslySetInnerHTML={{ __html: contentPages[contentPage] ?? "" }}
                          />
                        </div>

                        {contentPages.length > 1 && (
                          <div className="flex items-center justify-between text-sm text-white/70">
                            <span>
                              Page {contentPage + 1} of {contentPages.length}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                disabled={contentPage === 0}
                                onClick={() => setContentPage((prev) => Math.max(0, prev - 1))}
                                className="rounded-full border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                disabled={contentPage === contentPages.length - 1}
                                onClick={() =>
                                  setContentPage((prev) =>
                                    Math.min(contentPages.length - 1, prev + 1)
                                  )
                                }
                                className="rounded-full border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            onClick={handleBackToGrid}
                            className="rounded-full border-white/20 bg-white/10 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                          >
                            Back to All Articles
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

