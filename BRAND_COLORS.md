# Brand Colors & Typography
## Daddy Jobe Comprehensive School

---

## 🎨 Brand Colors

### Primary Colors

**Navy Blue**
- Hex: `#1B2B5C`
- Usage: Primary brand color, navigation, buttons, headings
- CSS Variable: `--primary`, `--navy`

**Gold/Bronze**
- Hex: `#BE9256`
- Usage: Accents, highlights, CTAs, gold elements
- CSS Variable: `--accent`, `--gold`

**White**
- Hex: `#FFFFFF`
- Usage: Backgrounds, text on dark backgrounds
- CSS Variable: `--background`, `--white`

### Color Utilities

```css
/* Available Tailwind Classes */
.bg-navy       /* #1B2B5C */
.text-navy     /* #1B2B5C */
.bg-gold       /* #BE9256 */
.text-gold     /* #BE9256 */
.border-gold   /* #BE9256 */
.border-navy   /* #1B2B5C */
```

---

## 🔤 Typography

**Primary Font: Poppins**
- Source: Google Fonts
- Weights: 300, 400, 500, 600, 700, 800
- Variable: `--font-poppins`
- Usage: All text throughout the website

**Font Loading:**
- Optimized with `next/font`
- `display: swap` for performance
- Preloaded for faster rendering

---

## 📝 Usage Examples

### In Components
```typescript
// Using brand colors
<div className="bg-navy text-white">
  <h1 className="text-gold">Title</h1>
</div>

// Using Tailwind color utilities
<button className="bg-primary hover:bg-primary/90 text-primary-foreground">
  Click Me
</button>

// Gold accents
<div className="border-2 border-gold hover:border-gold/80">
  Content
</div>
```

### CSS Variables
```css
/* Available CSS Variables */
--navy: #1B2B5C
--gold: #BE9256
--white: #FFFFFF
--primary: #1B2B5C
--accent: #BE9256
```

---

## ✅ Implementation Status

- ✅ Brand colors defined in globals.css
- ✅ Poppins font configured in layout.tsx
- ✅ CSS variables set up
- ✅ Tailwind utilities available
- ✅ Components updated to use brand colors

---

**Last Updated:** January 2025

