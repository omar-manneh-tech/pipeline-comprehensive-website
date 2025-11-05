-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorRole" TEXT,
    "publishedDate" DATETIME NOT NULL,
    "readTime" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT
);

-- CreateTable
CREATE TABLE "staff_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT,
    "position" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "image" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "qualifications" TEXT NOT NULL,
    "experience" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "news_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "type" TEXT NOT NULL,
    "eventDate" DATETIME,
    "location" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "page_contents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_category_idx" ON "blog_posts"("category");

-- CreateIndex
CREATE INDEX "blog_posts_published_idx" ON "blog_posts"("published");

-- CreateIndex
CREATE INDEX "blog_posts_publishedDate_idx" ON "blog_posts"("publishedDate");

-- CreateIndex
CREATE INDEX "blog_posts_featured_idx" ON "blog_posts"("featured");

-- CreateIndex
CREATE INDEX "staff_members_role_idx" ON "staff_members"("role");

-- CreateIndex
CREATE INDEX "staff_members_published_idx" ON "staff_members"("published");

-- CreateIndex
CREATE INDEX "staff_members_order_idx" ON "staff_members"("order");

-- CreateIndex
CREATE INDEX "staff_members_department_idx" ON "staff_members"("department");

-- CreateIndex
CREATE UNIQUE INDEX "news_events_slug_key" ON "news_events"("slug");

-- CreateIndex
CREATE INDEX "news_events_type_idx" ON "news_events"("type");

-- CreateIndex
CREATE INDEX "news_events_published_idx" ON "news_events"("published");

-- CreateIndex
CREATE INDEX "news_events_eventDate_idx" ON "news_events"("eventDate");

-- CreateIndex
CREATE INDEX "news_events_featured_idx" ON "news_events"("featured");

-- CreateIndex
CREATE INDEX "news_events_slug_idx" ON "news_events"("slug");

-- CreateIndex
CREATE INDEX "gallery_items_category_idx" ON "gallery_items"("category");

-- CreateIndex
CREATE INDEX "gallery_items_published_idx" ON "gallery_items"("published");

-- CreateIndex
CREATE INDEX "gallery_items_order_idx" ON "gallery_items"("order");

-- CreateIndex
CREATE INDEX "page_contents_page_idx" ON "page_contents"("page");

-- CreateIndex
CREATE INDEX "page_contents_published_idx" ON "page_contents"("published");

-- CreateIndex
CREATE UNIQUE INDEX "page_contents_page_section_key" ON "page_contents"("page", "section");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");

-- CreateIndex
CREATE INDEX "site_settings_key_idx" ON "site_settings"("key");
