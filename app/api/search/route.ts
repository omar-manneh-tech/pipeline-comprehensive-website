/**
 * Search API Route
 * Provides search functionality for pages, content, and programs
 * Supports full-text search across the website
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Search result schema
const searchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  type: z.enum(["page", "content", "program", "section"]),
});

const searchRequestSchema = z.object({
  query: z.string().min(1).max(200),
});

// Search index - pages and content that should be searchable
const searchIndex = [
  // Main Pages
  {
    id: "home",
    title: "Home",
    description: "Welcome to Daddy Jobe Comprehensive School - Empowering Future Leaders",
    url: "/",
    type: "page" as const,
    keywords: ["home", "welcome", "main", "landing"],
  },
  {
    id: "about",
    title: "About Us",
    description: "Learn about Daddy Jobe Comprehensive School, our history, mission, and values",
    url: "/about",
    type: "page" as const,
    keywords: ["about", "history", "mission", "values", "school", "institution"],
  },
  {
    id: "academics",
    title: "Academics",
    description: "Explore our academic programs, curriculum, and educational offerings",
    url: "/academics",
    type: "page" as const,
    keywords: ["academics", "programs", "curriculum", "education", "courses"],
  },
  {
    id: "admissions",
    title: "Admissions",
    description: "Admission requirements, application process, and enrollment information",
    url: "/admissions",
    type: "page" as const,
    keywords: ["admissions", "apply", "enrollment", "requirements", "application"],
  },
  {
    id: "campus-life",
    title: "Campus Life",
    description: "Discover campus activities, student life, clubs, sports, and facilities",
    url: "/campus-life",
    type: "page" as const,
    keywords: ["campus", "life", "activities", "clubs", "sports", "facilities", "student"],
  },
  {
    id: "contact",
    title: "Contact Us",
    description: "Get in touch with Daddy Jobe Comprehensive School",
    url: "/contact",
    type: "page" as const,
    keywords: ["contact", "email", "phone", "address", "location"],
  },
  {
    id: "library",
    title: "Library",
    description: "Empowering Learning Through Knowledge - Access our library resources, books, and digital materials",
    url: "/library",
    type: "page" as const,
    keywords: ["library", "books", "resources", "digital", "learning", "research"],
  },
  {
    id: "staff",
    title: "Staff",
    description: "Meet our dedicated teaching staff and faculty members",
    url: "/staff",
    type: "page" as const,
    keywords: ["staff", "teachers", "faculty", "instructors", "professors"],
  },
  {
    id: "gallery",
    title: "Gallery",
    description: "View photos and images from school events, activities, and campus life",
    url: "/gallery",
    type: "page" as const,
    keywords: ["gallery", "photos", "images", "pictures", "events"],
  },
  {
    id: "news",
    title: "News & Events",
    description: "Stay updated with the latest news, events, and announcements",
    url: "/news",
    type: "page" as const,
    keywords: ["news", "events", "announcements", "updates", "latest"],
  },
  // Academic Programs
  {
    id: "science",
    title: "Science Program",
    description: "Science program with courses in Physics, Chemistry, Biology, and Mathematics",
    url: "/academics/science",
    type: "program" as const,
    keywords: ["science", "physics", "chemistry", "biology", "mathematics", "stem"],
  },
  {
    id: "commerce",
    title: "Commerce Program",
    description: "Commerce program with courses in Business, Accounting, Economics, and Management",
    url: "/academics/commerce",
    type: "program" as const,
    keywords: ["commerce", "business", "accounting", "economics", "management", "finance"],
  },
  {
    id: "arts",
    title: "Arts Program",
    description: "Arts program with courses in Literature, History, Geography, and Languages",
    url: "/academics/arts",
    type: "program" as const,
    keywords: ["arts", "literature", "history", "geography", "languages", "humanities"],
  },
];

/**
 * Simple search function
 * Searches through the search index for matching results
 */
function search(query: string): Array<{
  id: string;
  title: string;
  description: string;
  url: string;
  type: "page" | "content" | "program" | "section";
}> {
  const queryLower = query.toLowerCase().trim();
  const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 0);

  if (queryWords.length === 0) {
    return [];
  }

  // Score each result
  const scoredResults = searchIndex.map((item) => {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const descriptionLower = item.description.toLowerCase();
    const keywordsLower = item.keywords.map((k) => k.toLowerCase());

    // Check each query word
    for (const word of queryWords) {
      // Exact title match (highest priority)
      if (titleLower === word || titleLower.includes(word)) {
        score += 10;
      }

      // Title contains word
      if (titleLower.includes(word)) {
        score += 5;
      }

      // Description contains word
      if (descriptionLower.includes(word)) {
        score += 3;
      }

      // Keywords match
      if (keywordsLower.some((keyword) => keyword.includes(word) || word.includes(keyword))) {
        score += 2;
      }
    }

    return { ...item, score };
  });

  // Filter and sort by score, remove score and keywords from result
  return scoredResults
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ score, keywords, ...item }) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      url: item.url,
      type: item.type,
    }));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = searchRequestSchema.parse(body);

    // Perform search
    const results = search(query);

    // Limit results
    const limitedResults = results.slice(0, 10);

    // Validate results
    const validatedResults = limitedResults.map((result) =>
      searchResultSchema.parse({
        id: result.id,
        title: result.title,
        description: result.description,
        url: result.url,
        type: result.type,
      })
    );

    return NextResponse.json(
      {
        success: true,
        results: validatedResults,
        count: validatedResults.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Search API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// GET method for simple queries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter 'q' is required",
        },
        { status: 400 }
      );
    }

    const { query: validatedQuery } = searchRequestSchema.parse({ query });

    // Perform search
    const results = search(validatedQuery);

    // Limit results
    const limitedResults = results.slice(0, 10);

    // Validate results
    const validatedResults = limitedResults.map((result) =>
      searchResultSchema.parse({
        id: result.id,
        title: result.title,
        description: result.description,
        url: result.url,
        type: result.type,
      })
    );

    return NextResponse.json(
      {
        success: true,
        results: validatedResults,
        count: validatedResults.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Search API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

