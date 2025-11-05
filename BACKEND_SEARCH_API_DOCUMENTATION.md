# Backend Search API Documentation

## Overview

The Search API provides full-text search functionality across the website, allowing users to search for pages, content, and programs. The API is implemented as a Next.js API route with both POST and GET methods.

## API Endpoint

### Route
```
/api/search
```

### Methods
- **POST**: Search with query in request body
- **GET**: Search with query parameter

## Request Format

### POST Request

**URL**: `/api/search`

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "query": "academics"
}
```

**Query Parameters**: None

### GET Request

**URL**: `/api/search?q=academics`

**Method**: `GET`

**Query Parameters**:
- `q` (required): Search query string (1-200 characters)

## Response Format

### Success Response

**Status Code**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "results": [
    {
      "id": "academics",
      "title": "Academics",
      "description": "Explore our academic programs, curriculum, and educational offerings",
      "url": "/academics",
      "type": "page"
    }
  ],
  "count": 1
}
```

### Error Responses

#### 400 Bad Request

**Status Code**: `400 Bad Request`

**Response Body**:
```json
{
  "success": false,
  "error": "Invalid request",
  "details": [
    {
      "path": ["query"],
      "message": "String must contain at least 1 character(s)"
    }
  ]
}
```

#### 500 Internal Server Error

**Status Code**: `500 Internal Server Error`

**Response Body**:
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Request Validation

### Schema

**Input Schema** (Zod):
```typescript
{
  query: z.string().min(1).max(200)
}
```

**Validation Rules**:
- Query must be a string
- Query must be at least 1 character
- Query must be at most 200 characters

### Output Schema

**Result Schema** (Zod):
```typescript
{
  id: string;
  title: string;
  description: string;
  url: string;
  type: "page" | "content" | "program" | "section";
}
```

## Search Algorithm

### Scoring System

The search algorithm uses a scoring system to rank results:

1. **Title Exact Match**: +10 points
   - Query exactly matches the title (case-insensitive)

2. **Title Contains**: +5 points
   - Title contains the query word

3. **Description Contains**: +3 points
   - Description contains the query word

4. **Keywords Match**: +2 points
   - Any keyword matches the query word

### Ranking Process

1. Split query into words
2. Score each searchable item based on match types
3. Filter items with score > 0
4. Sort by score (descending)
5. Limit to top 10 results

### Example Scoring

**Query**: "academics"

**Item**: "Academics" page
- Title exact match: +10
- Title contains: +5
- Description contains: +3
- **Total**: 18 points

## Search Index

### Structure

The search index is an array of searchable items:

```typescript
{
  id: string;              // Unique identifier
  title: string;           // Display title
  description: string;     // Display description
  url: string;             // Page URL
  type: "page" | "program" | "content" | "section";
  keywords: string[];      // Search keywords
}
```

### Current Index

#### Main Pages
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

#### Academic Programs
- Science Program (/academics/science)
- Commerce Program (/academics/commerce)
- Arts Program (/academics/arts)

### Adding New Items

To add a new searchable item:

1. Add to `searchIndex` array in `app/api/search/route.ts`
2. Include all required fields:
   - `id`: Unique identifier
   - `title`: Display title
   - `description`: Display description
   - `url`: Page URL
   - `type`: Item type
   - `keywords`: Array of relevant keywords

Example:
```typescript
{
  id: "new-page",
  title: "New Page",
  description: "Description of the new page",
  url: "/new-page",
  type: "page",
  keywords: ["new", "page", "example"],
}
```

## Error Handling

### Validation Errors

**Zod Validation Errors**:
- Invalid query format
- Query too short or too long
- Missing required fields

**Response**: 400 Bad Request with error details

### Server Errors

**Internal Server Errors**:
- Database connection issues
- Unexpected errors during search
- Processing errors

**Response**: 500 Internal Server Error with generic error message

### Error Logging

All errors are logged to console:
```typescript
console.error("Search API error:", error);
```

## Rate Limiting

**Current Status**: Not implemented

**Future Enhancement**: Add rate limiting to prevent abuse:
- Limit requests per IP
- Limit requests per session
- Implement exponential backoff

## Security Considerations

### Input Sanitization

- Query strings are validated with Zod
- Length limits prevent DoS attacks
- No SQL injection (no database queries)

### Output Sanitization

- Results are validated with Zod
- No sensitive information in responses
- URLs are validated to prevent XSS

### CORS

- CORS handled by Next.js
- Same-origin requests only

## Performance

### Optimization

- **Scoring**: Simple in-memory scoring (fast)
- **Result Limiting**: Maximum 10 results
- **Caching**: Future enhancement

### Scalability

- **Current**: In-memory search index
- **Future**: Database-backed search index
- **Future**: Full-text search with Elasticsearch or similar

## Testing

### Unit Tests

Test cases:
1. Valid query returns results
2. Empty query returns empty results
3. Invalid query format returns 400
4. Query too long returns 400
5. Results are ranked correctly
6. Results are limited to 10

### Integration Tests

Test cases:
1. POST request with valid query
2. GET request with valid query
3. Error handling for invalid requests
4. Response format validation

### Manual Testing

```bash
# POST request
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "academics"}'

# GET request
curl http://localhost:3000/api/search?q=academics

# Invalid request (empty query)
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": ""}'
```

## API Usage Examples

### JavaScript/TypeScript

```typescript
// Using fetch
const response = await fetch('/api/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: 'academics' }),
});

const data = await response.json();
console.log(data.results);
```

### Using API Client

```typescript
import { apiClient } from '@/services/api/client';

const response = await apiClient.post('/api/search', {
  query: 'academics',
});

const results = response.data.results;
```

## Future Enhancements

1. **Full-Text Search**:
   - Search page content
   - Search staff profiles
   - Search news articles

2. **Advanced Filtering**:
   - Filter by type (page, program, content)
   - Filter by category
   - Date range filters

3. **Search Analytics**:
   - Track popular searches
   - Search suggestions
   - Recent searches

4. **Database Integration**:
   - Store search index in database
   - Dynamic search index updates
   - Search history

5. **Performance Improvements**:
   - Result caching
   - Index caching
   - Search result pagination

6. **Security Enhancements**:
   - Rate limiting
   - Input sanitization improvements
   - XSS prevention

## Maintenance

### Updating Search Index

1. Edit `searchIndex` array in `app/api/search/route.ts`
2. Add/update searchable items
3. Test search functionality
4. Deploy changes

### Modifying Search Algorithm

1. Edit `search()` function in `app/api/search/route.ts`
2. Adjust scoring weights
3. Test with various queries
4. Deploy changes

### Monitoring

- Monitor API response times
- Track error rates
- Monitor search query patterns
- Analyze popular searches

## Dependencies

- **Next.js**: API Routes
- **Zod**: Input/output validation
- **TypeScript**: Type safety

## File Location

```
app/api/search/route.ts
```

