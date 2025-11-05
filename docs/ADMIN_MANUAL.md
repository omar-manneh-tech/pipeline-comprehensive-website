# Admin CMS Manual
## Daddy Jobe Comprehensive School Website

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Page Content Management](#page-content-management)
4. [Media Library](#media-library)
5. [Navigation Management](#navigation-management)
6. [Footer Management](#footer-management)
7. [Dynamic Content](#dynamic-content)
8. [Feature Flags](#feature-flags)
9. [Site Settings](#site-settings)
10. [SEO Management](#seo-management)
11. [Backup & Restore](#backup--restore)
12. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Enter your admin credentials
3. You'll be redirected to the dashboard

### Dashboard Overview

The dashboard provides:
- **Quick Stats:** Total blog posts, staff members, gallery items, news articles
- **Recent Activity:** Latest content updates
- **Quick Actions:** Direct links to common tasks

---

## Page Content Management

### Home Page Management

**Location:** `/admin/pages/home`

**Features:**
- **Section Visibility:** Toggle sections on/off
- **Drag-and-Drop Reordering:** Reorder sections by dragging
- **Content Editing:** Edit section content (title, description, images, etc.)
- **Save/Publish:** Save changes and publish to live site

**Sections:**
- Hero Section
- About Section
- Core Values Section
- Student Life Section
- Library Section
- Statistics Section
- Events Carousel
- Explore Section
- Testimonials Section

**How to Use:**
1. Click "Edit" on any section
2. Modify content in the edit modal
3. Upload images using the image uploader
4. Click "Save" to save changes
5. Toggle visibility using the eye icon
6. Drag sections to reorder

### About Page Management

**Location:** `/admin/pages/about`

**Sections:**
- Hero Banner
- School History
- Mission & Vision
- Leadership
- Achievements

**How to Use:**
1. Click "Edit" on a section
2. Fill in the form fields
3. Upload images if needed
4. Click "Save"

### Academics Pages Management

**Location:** `/admin/pages/academics`

**Sections:**
- Hero Banner
- Overview
- Programs
- Facilities
- Core Subjects
- Elective Subjects
- Career Paths
- Program Requirements
- WASSCE Preparation

**How to Use:**
1. Edit sections using the JSON editor for complex content
2. Use the Hero Banner form for simple content
3. Save changes to publish

### Admissions Page Management

**Location:** `/admin/pages/admissions`

**Sections:**
- Hero Banner
- Admission Process
- Requirements
- Important Dates
- How to Apply
- Contact Admissions

### Generic Page Management

**Location:** `/admin/pages/[page]`

**Supported Pages:**
- Library
- Gallery
- News
- Staff
- Contact
- Campus Life
- Portal
- Privacy

**How to Use:**
1. Select a page from the Pages Management Hub
2. Add custom sections using "Add Custom Section"
3. Edit existing sections
4. Reorder sections by dragging

---

## Media Library

**Location:** `/admin/media`

### Features

- **Upload Media:** Upload images and documents
- **Grid/List View:** Toggle between grid and list views
- **Search & Filter:** Search by name, title, or folder
- **Edit Metadata:** Edit alt text, title, and description
- **Delete:** Remove unused media assets
- **Folder Organization:** Organize media by folders (blog, staff, gallery, etc.)

### Uploading Media

1. Click "Upload Media"
2. Select file(s) from your computer
3. File will be automatically optimized
4. Media appears in the library

### Editing Media

1. Click on a media item
2. Click "Edit" button
3. Modify alt text, title, or description
4. Click "Save Changes"

### Best Practices

- Use descriptive filenames
- Add alt text for accessibility
- Organize files in appropriate folders
- Optimize images before upload (recommended)

---

## Navigation Management

**Location:** `/admin/navigation`

### Features

- **Add Menu Items:** Add new navigation items
- **Edit Items:** Modify label, URL, and target
- **Reorder:** Drag and drop to reorder
- **Submenu Support:** Create nested menus (max 1 level)
- **Visibility Toggle:** Show/hide menu items

### Adding Navigation Items

1. Click "Add Navigation Item"
2. Enter label and URL
3. Select parent item for submenu (optional)
4. Choose target (_self or _blank)
5. Add icon name (optional)
6. Click "Save"

### Reordering Navigation

1. Drag items by the grip handle
2. Drop in desired position
3. Changes save automatically

---

## Footer Management

**Location:** `/admin/footer`

### Features

- **Footer Sections:** Manage footer sections (Quick Links, Programs, Custom)
- **Footer Links:** Add/edit/delete links within sections
- **Reorder:** Reorder sections and links
- **Visibility:** Toggle visibility of sections and links

### Managing Footer Sections

1. Click "Add Footer Section"
2. Select section type (Quick Links, Programs, Custom)
3. Enter section title
4. Click "Save"

### Managing Footer Links

1. Expand a footer section
2. Click "Add Link"
3. Enter label and URL
4. Click "Save"

---

## Dynamic Content

### Testimonials Management

**Location:** `/admin/testimonials`

**Features:**
- Add/edit/delete testimonials
- Featured toggle
- Published/Draft toggle
- Image upload
- Drag-and-drop reordering
- Search and filtering

**How to Add Testimonial:**
1. Click "Add Testimonial"
2. Enter name, role, and text
3. Upload profile image
4. Toggle featured and published
5. Click "Save"

### Statistics Management

**Location:** `/admin/statistics`

**Features:**
- Add/edit/delete statistics
- Icon picker (Lucide icons)
- Color picker (predefined gradients)
- Visibility toggle
- Drag-and-drop reordering

**How to Add Statistic:**
1. Click "Add Statistic"
2. Enter number and suffix (+, %, etc.)
3. Select icon from dropdown
4. Enter title and description
5. Choose background color
6. Click "Save"

---

## Feature Flags

**Location:** `/admin/flags`

### Purpose

Feature flags allow you to enable/disable features on the website without code changes.

### Available Flags

- `events_carousel` - Events carousel on home page
- `testimonials` - Testimonials section
- `statistics` - Statistics section
- `search` - Search functionality
- `blog` - Blog page
- `gallery` - Gallery page

### How to Use

1. Click "Add Feature Flag" to create new flag
2. Toggle enabled/disabled using the toggle button
3. Changes take effect immediately

---

## Site Settings

**Location:** `/admin/settings`

### Categories

#### General Settings
- Site Name
- Short Name
- Description
- Site URL
- Logo URL
- Favicon URL

#### Contact Information
- Email Address
- Phone Number
- Physical Address
- Map Coordinates

#### Social Media Links
- Facebook URL
- Twitter URL
- Instagram URL
- LinkedIn URL
- YouTube URL

#### Theme & Appearance
- Primary Color
- Secondary Color
- Font Family

#### Other Links
- Portal URL
- External Links

### How to Use

1. Navigate to the relevant category
2. Edit settings
3. Click "Save [Category Name]" to save category
4. Or click "Save All Settings" to save everything

---

## SEO Management

**Location:** `/admin/seo`

### Features

- **Per-Page SEO:** Manage SEO metadata for each page
- **Meta Tags:** Title, description, keywords
- **Open Graph:** OG image, type
- **Twitter Card:** Twitter card configuration
- **Canonical URL:** Set canonical URLs

### How to Use

1. Select a page from the list
2. Fill in SEO fields:
   - **Page Title:** SEO title (60 characters recommended)
   - **Meta Description:** SEO description (160 characters recommended)
   - **Keywords:** Comma-separated keywords
   - **OG Image:** Social media sharing image (1200x630px recommended)
   - **OG Type:** Website or Article
   - **Twitter Card:** Summary or Summary Large Image
   - **Canonical URL:** Preferred URL
3. Click "Save SEO Settings"

### Preview

The preview shows how your page will appear in search results and social media.

---

## Backup & Restore

**Location:** `/admin/backup`

### Creating Backups

1. Click "Create Backup"
2. Backup is created automatically with timestamp
3. Backup is stored in `backups/` directory

### Restoring Backups

1. Select a backup from the list
2. Click "Restore"
3. Confirm restoration
4. Current database is backed up automatically before restore

### Manual Backup (Command Line)

**Windows (PowerShell):**
```powershell
.\scripts\backup-db.ps1
```

**Linux/Mac:**
```bash
bash scripts/backup-db.sh
```

### Manual Restore (Command Line)

**Windows (PowerShell):**
```powershell
.\scripts\restore-db.ps1
```

**Linux/Mac:**
```bash
bash scripts/restore-db.sh
```

---

## Troubleshooting

### Images Not Uploading

- Check file size (max 10MB)
- Ensure file is an image format (JPG, PNG, WebP, etc.)
- Check folder permissions

### Changes Not Appearing

- Clear browser cache
- Check if section is visible (toggle on)
- Verify feature flags are enabled
- Check if content is published

### Navigation Not Updating

- Ensure navigation items are visible
- Check if parent items are visible
- Clear browser cache
- Verify API is accessible

### Backup Fails

- Check disk space
- Verify backup directory permissions
- Ensure database file exists

---

## Best Practices

### Content Management

1. **Always Preview:** Preview changes before publishing
2. **Use Drafts:** Save drafts before publishing
3. **Backup Regularly:** Create backups before major changes
4. **Test Features:** Test feature flags before enabling

### Media Management

1. **Optimize Images:** Compress images before upload
2. **Use Descriptive Names:** Name files clearly
3. **Add Alt Text:** Always add alt text for accessibility
4. **Organize by Folders:** Use folders to organize media

### SEO Management

1. **Unique Titles:** Use unique titles for each page
2. **Descriptive Descriptions:** Write compelling descriptions
3. **Keywords:** Use relevant, targeted keywords
4. **OG Images:** Always include OG images for social sharing

---

## Support

For technical support or questions:
- Email: [Your Support Email]
- Documentation: `/docs/ADMIN_MANUAL.md`
- GitHub Issues: [Your Repository URL]

---

**Last Updated:** 2024  
**Version:** 1.0

