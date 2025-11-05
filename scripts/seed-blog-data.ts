/**
 * Seed Blog Data Script
 * Migrates existing blog posts from lib/data/blog.ts to database
 * 
 * Usage: npx tsx scripts/seed-blog-data.ts
 */

import { prisma } from "../lib/db/client";
import { blogPosts } from "../lib/data/blog";

async function main() {
  console.log("🌱 Starting blog data migration...");

  // Get the first admin user (for createdBy field)
  const admin = await prisma.admin.findFirst({
    where: {
      role: {
        in: ["admin", "super_admin"],
      },
    },
  });

  if (!admin) {
    console.error("❌ No admin user found. Please create an admin user first.");
    console.log("   Run: npm run create-admin");
    process.exit(1);
  }

  const adminId = admin.id;
  console.log(`✅ Using admin: ${admin.name} (${admin.email})`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of blogPosts) {
    try {
      // Check if post already exists
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: post.slug },
      });

      if (existingPost) {
        console.log(`⏭️  Skipping existing post: ${post.title}`);
        skipped++;
        continue;
      }

      // Convert tags array to JSON string (SQLite limitation)
      const tagsJson = JSON.stringify(post.tags);

      // Parse published date
      const publishedDate = new Date(post.publishedDate);

      // Create blog post
      await prisma.blogPost.create({
        data: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          image: post.image,
          category: post.category,
          tags: tagsJson,
          author: post.author,
          authorRole: post.authorRole || null,
          publishedDate: publishedDate,
          readTime: post.readTime,
          featured: post.featured || false,
          published: true, // Mark all existing posts as published
          createdBy: adminId,
        },
      });

      console.log(`✅ Created: ${post.title}`);
      created++;
    } catch (error) {
      console.error(`❌ Error creating post "${post.title}":`, error);
    }
  }

  console.log("\n📊 Migration Summary:");
  console.log(`   ✅ Created: ${created} posts`);
  console.log(`   ⏭️  Skipped: ${skipped} posts (already exist)`);
  console.log(`   📝 Total: ${blogPosts.length} posts`);
  console.log("\n✨ Blog data migration completed!");
}

main()
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

