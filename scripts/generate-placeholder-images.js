/**
 * Generate Placeholder Images
 * Creates all required placeholder images for the website
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Colors for different image categories
const colors = {
  hero: { r: 30, g: 64, b: 175 },      // Navy blue
  gallery: { r: 59, g: 130, b: 246 },  // Blue
  about: { r: 34, g: 197, b: 94 },     // Green
  academics: { r: 139, g: 92, b: 246 }, // Purple
  misc: { r: 156, g: 163, b: 175 },    // Gray
};

// Image sizes and configurations
const imagesToGenerate = [
  // Hero images
  { path: 'hero/hero-main.jpg', width: 1920, height: 1080, color: colors.hero, label: 'HERO MAIN' },
  { path: 'hero/admission-banner.jpg', width: 1920, height: 600, color: colors.hero, label: 'ADMISSIONS' },
  { path: 'hero/library-banner.jpg', width: 1920, height: 600, color: colors.hero, label: 'LIBRARY' },
  { path: 'hero/contact-banner.jpg', width: 1920, height: 600, color: colors.hero, label: 'CONTACT' },
  { path: 'hero/about_banner.jpg', width: 1920, height: 600, color: colors.hero, label: 'ABOUT' },
  { path: 'hero/academics_banner.jpg', width: 1920, height: 600, color: colors.hero, label: 'ACADEMICS' },
  { path: 'hero/staff_banner.jpg', width: 1920, height: 600, color: colors.hero, label: 'STAFF' },
  
  // About images
  { path: 'about/school_building.jpg', width: 1200, height: 800, color: colors.about, label: 'SCHOOL BUILDING' },
  { path: 'about/students_in_class.jpg', width: 1200, height: 800, color: colors.about, label: 'STUDENTS IN CLASS' },
  { path: 'about/morning_assembly.jpg', width: 1200, height: 800, color: colors.about, label: 'MORNING ASSEMBLY' },
  
  // Academics images
  { path: 'academics/science_lab.jpg', width: 1200, height: 800, color: colors.academics, label: 'SCIENCE LAB' },
  { path: 'academics/commerce_class.jpg', width: 1200, height: 800, color: colors.academics, label: 'COMMERCE CLASS' },
  { path: 'academics/arts_studio.jpg', width: 1200, height: 800, color: colors.academics, label: 'ARTS STUDIO' },
  { path: 'academics/ict_lab.jpg', width: 1200, height: 800, color: colors.academics, label: 'ICT LAB' },
  
  // Gallery images
  { path: 'gallery/science_fair.jpg', width: 800, height: 600, color: colors.gallery, label: 'SCIENCE FAIR' },
  { path: 'gallery/graduation_day.jpg', width: 800, height: 600, color: colors.gallery, label: 'GRADUATION DAY' },
  { path: 'gallery/sports_day.jpg', width: 800, height: 600, color: colors.gallery, label: 'SPORTS DAY' },
  { path: 'gallery/cultural_day.jpg', width: 800, height: 600, color: colors.gallery, label: 'CULTURAL DAY' },
  { path: 'gallery/gallery_banner.jpg', width: 1920, height: 600, color: colors.gallery, label: 'GALLERY' },
  { path: 'gallery/news_banner.jpg', width: 1920, height: 600, color: colors.gallery, label: 'NEWS' },
  { path: 'gallery/calendar_banner.jpg', width: 1920, height: 600, color: colors.gallery, label: 'CALENDAR' },
  { path: 'gallery/portal_banner.jpg', width: 1920, height: 600, color: colors.gallery, label: 'PORTAL' },
  
  // Misc images
  { path: 'misc/placeholder_profile.jpg', width: 400, height: 400, color: colors.misc, label: 'PROFILE' },
  { path: 'misc/logo.png', width: 200, height: 200, color: { r: 27, g: 43, b: 92 }, label: 'DJ' }, // Brand Navy #1B2B5C
];

async function generateImage(config) {
  const { path: imagePath, width, height, color, label } = config;
  const fullPath = path.join(__dirname, '..', 'public', 'images', imagePath);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create SVG with text label
  // For logo, make it round and centered
  const isLogo = imagePath.includes('logo.png');
  const svg = isLogo 
    ? `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="50%" fill="rgb(${color.r},${color.g},${color.b})"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 2.5}" 
              fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
          ${label}
        </text>
      </svg>
    `
    : `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="rgb(${color.r},${color.g},${color.b})"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 10}" 
              fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
          ${label}
        </text>
        <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 20}" 
              fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">
          ${width}x${height}
        </text>
      </svg>
    `;
  
  try {
    const isPng = imagePath.endsWith('.png');
    const image = sharp(Buffer.from(svg));
    
    if (isPng) {
      await image.png({ quality: 90 }).toFile(fullPath);
    } else {
      await image.jpeg({ quality: 85 }).toFile(fullPath);
    }
    
    console.log(`✅ Created: ${imagePath}`);
  } catch (error) {
    console.error(`❌ Error creating ${imagePath}:`, error.message);
  }
}

async function generateAllImages() {
  console.log('🎨 Generating placeholder images...\n');
  
  for (const config of imagesToGenerate) {
    await generateImage(config);
  }
  
  console.log('\n✅ All placeholder images generated!');
}

generateAllImages().catch(console.error);

