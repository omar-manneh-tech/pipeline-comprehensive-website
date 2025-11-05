# Search Feature Documentation

## Overview

The search feature provides full-text search functionality across the website, allowing users to quickly find pages, content, and programs. The search is implemented as a modal overlay accessible from the navbar.

## Frontend Implementation

### Location
- **Primary**: Navbar (right side, next to Portal Login button)
- **Secondary**: Footer section (new column)
- **Component**: Search modal overlay (navbar) and inline search (footer)
- **Accessibility**: Keyboard shortcuts (ESC to close), focus management

### Components

#### 1. SearchButton (`components/Search/SearchButton.tsx`)
- **Purpose**: Button that opens the search modal
- **Location**: Navbar, right side
- **Props**:
  - `onClick`: Function to open the search modal
- **Features**:
  - Ghost button style
  - Icon-only design
  - Accessible with aria-label

#### 2. SearchModal (`components/Search/SearchModal.tsx`)
- **Purpose**: Main search interface with modal overlay
- **Features**:
  - Search input with autocomplete
  - Real-time search results
  - Loading states
  - Error handling
  - Results display with icons and descriptions
  - Keyboard navigation (ESC to close)
  - Debounced search (300ms delay)
  - Result filtering and ranking

**Props**:
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close the modal

**State Management**:
- `query`: Current search query
- `results`: Array of search results
- `isLoading`: Loading state
- `error`: Error message

**Search Result Types**:
- `page`: Main website pages
- `content`: Content sections
- `program`: Academic programs
- `section`: Page sections

#### 3. FooterSearch (`components/Search/FooterSearch.tsx`)
- **Purpose**: Inline search interface for the footer section
- **Features**:
  - Beautiful footer-styled search input
  - Dropdown results display
  - Real-time search with debouncing
  - Loading states
  - Hover effects and animations
  - Click outside to close
  - Search tips display

**Features**:
- Inline search input with footer styling
- Results dropdown that appears below input
- Gold accent color on focus
- Backdrop blur effect
- Smooth animations
- Search tips for guidance

### Integration

#### Navbar Integration (`components/Navbar.tsx`)
- Search button added to navbar (right side)
- Search modal state management
- Search button positioned between navigation and Portal Login button

**Code Changes**:
```typescript
// Added imports
import { SearchButton } from "@/components/Search/SearchButton";
import { SearchModal } from "@/components/Search/SearchModal";

// Added state
const [searchOpen, setSearchOpen] = useState(false);

// Added to navbar
<SearchButton onClick={() => setSearchOpen(true)} />
<SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
```

#### Footer Integration (`components/Footer.tsx`)
- Footer search added as a new column
- Grid layout updated from 4 columns to 5 columns
- Search section positioned between "Programs" and "Contact Us"

**Code Changes**:
```typescript
// Added import
import { FooterSearch } from "@/components/Search/FooterSearch";

// Updated grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

// Added search section
<div>
  <FooterSearch />
</div>
```

### User Experience

1. **Opening Search**:
   - Click search icon in navbar
   - Modal opens with focus on input
   - Keyboard shortcut: Cmd/Ctrl + K (optional future enhancement)

2. **Searching**:
   - Type query in search input
   - Results appear in real-time (debounced 300ms)
   - Loading indicator during search
   - Results ranked by relevance

3. **Results Display**:
   - Results show title, description, type, and URL
   - Icons for different result types
   - Clickable results navigate to page
   - Results limited to 10 items

4. **Closing Search**:
   - Click outside modal
   - Press ESC key
   - Click close button (X)

### Styling

- **Modal**: White background, rounded corners, shadow
- **Input**: Clean design with search icon
- **Results**: Hover effects, clear typography
- **Icons**: Color-coded by result type
- **Responsive**: Works on mobile and desktop

### Accessibility

- **Keyboard Navigation**: ESC to close, Tab to navigate
- **Focus Management**: Auto-focus on input when modal opens
- **ARIA Labels**: Proper labels for screen readers
- **Semantic HTML**: Proper HTML structure

## Backend Implementation

### API Endpoint

**Route**: `/api/search`

**Methods**:
- `POST`: Search with query in request body
- `GET`: Search with query parameter `q`

### Request Format

**POST Request**:
```json
{
  "query": "academics"
}
```

**GET Request**:
```
GET /api/search?q=academics
```

### Response Format

```json
{
  "success": true,
  "results": [
    {
      "id": "academics",
      "title": "Academics",
      "description": "Explore our academic programs...",
      "url": "/academics",
      "type": "page"
    }
  ],
  "count": 1
}
```

### Search Algorithm

**Scoring System**:
1. **Title Exact Match**: +10 points
2. **Title Contains**: +5 points
3. **Description Contains**: +3 points
4. **Keywords Match**: +2 points

**Results**:
- Filtered by score > 0
- Sorted by score (descending)
- Limited to 10 results

### Search Index

The search index includes:
- **Main Pages**: Home, About, Academics, Admissions, Campus Life, Contact, Library, Staff, Gallery, News
- **Academic Programs**: Science, Commerce, Arts
- **Metadata**: Title, description, URL, type, keywords

### Search Index Structure

```typescript
{
  id: string;
  title: string;
  description: string;
  url: string;
  type: "page" | "content" | "program" | "section";
  keywords: string[];
}
```

### Validation

**Input Validation**:
- Query: 1-200 characters
- Zod schema validation
- Error handling for invalid requests

**Output Validation**:
- Results validated with Zod schema
- Type safety ensured

### Error Handling

- **400 Bad Request**: Invalid query or request format
- **500 Internal Server Error**: Server errors
- **Error Response Format**:
```json
{
  "success": false,
  "error": "Error message",
  "details": [] // Zod validation errors if applicable
}
```

## Searchable Content

### Pages
- Home (/)
- About (/about)
- Academics (/academics)
- Admissions (/admissions)
- Campus Life (/campus-life)
- Contact (/contact)
- Library (/library)
- Staff (/staff)
- Gallery (/gallery)
- News & Events (/news)

### Programs
- Science Program (/academics/science)
- Commerce Program (/academics/commerce)
- Arts Program (/academics/arts)

### Keywords
Each searchable item includes relevant keywords for better matching:
- School-specific terms
- Academic terms
- Common search queries
- Related topics

## Future Enhancements

1. **Advanced Search**:
   - Filters by type (page, program, content)
   - Date range filters
   - Category filters

2. **Search Analytics**:
   - Track popular searches
   - Search suggestions
   - Recent searches

3. **Full-Text Search**:
   - Search page content
   - Search staff profiles
   - Search news articles

4. **Keyboard Shortcuts**:
   - Cmd/Ctrl + K to open search
   - Arrow keys to navigate results
   - Enter to select result

5. **Search Suggestions**:
   - Autocomplete suggestions
   - Popular searches
   - Related searches

## Testing

### Manual Testing Checklist

- [ ] Search button appears in navbar
- [ ] Clicking search button opens modal
- [ ] ESC key closes modal
- [ ] Search input has focus on open
- [ ] Typing in search shows results
- [ ] Results are relevant and ranked
- [ ] Clicking result navigates to page
- [ ] Results show correct icons
- [ ] Loading state displays during search
- [ ] Error handling works correctly
- [ ] Mobile responsive design
- [ ] Keyboard navigation works

### API Testing

```bash
# POST request
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "academics"}'

# GET request
curl http://localhost:3000/api/search?q=academics
```

## Performance

- **Debouncing**: 300ms delay to reduce API calls
- **Result Limiting**: Maximum 10 results
- **Lazy Loading**: Search modal only loads when opened
- **Caching**: Future enhancement for search results

## Security

- **Input Validation**: Query length and format validation
- **Rate Limiting**: Future enhancement to prevent abuse
- **Sanitization**: Query sanitization for XSS prevention
- **Error Messages**: No sensitive information in errors

## Maintenance

### Adding New Searchable Items

1. Add item to `searchIndex` array in `app/api/search/route.ts`
2. Include: id, title, description, url, type, keywords
3. Test search functionality

### Updating Search Algorithm

1. Modify scoring system in `search()` function
2. Adjust weights for different match types
3. Test with various queries

## Dependencies

- **Frontend**: React, Framer Motion, Lucide React, Next.js
- **Backend**: Next.js API Routes, Zod validation
- **API Client**: Centralized API client (`services/api/client.ts`)

