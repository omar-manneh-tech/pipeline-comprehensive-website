# User Activity Tracking System Setup Guide

## Overview

The User Activity Tracking System has been implemented to track all user activities on the website and provide admin functionality to view and export activity data as CSV files.

## Features

✅ **Automatic Page View Tracking** - All page views are tracked via middleware  
✅ **Click Tracking** - Button and link clicks are automatically tracked  
✅ **Form Submission Tracking** - Form submissions are tracked  
✅ **Admin Dashboard** - View activities with filtering and pagination  
✅ **CSV Export** - Export activity data to CSV for admin team analysis  
✅ **Session Tracking** - User sessions are tracked across pages  

## Database Setup

### 1. Install Prisma

```bash
npm install @prisma/client prisma
```

### 2. Initialize Prisma (if not already done)

```bash
npx prisma init
```

### 3. Configure Database URL

Add to your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/school_db?schema=public"
```

Or for SQLite (development):

```env
DATABASE_URL="file:./dev.db"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Migrations

```bash
npx prisma migrate dev --name add_activity_tracking
```

## Architecture

### Database Models

The system uses the following Prisma models (defined in `prisma/schema.prisma`):

- **UserActivity** - Stores all user activities
- **UserSession** - Tracks user sessions
- **ContactSubmission** - Contact form submissions
- **Admin** - Admin users (for future authentication)

### API Endpoints

#### 1. Track Activity (POST `/api/analytics/track`)
- **Purpose:** Client-side tracking endpoint
- **Rate Limit:** 100 requests/minute
- **Usage:** Called automatically by tracking hooks

#### 2. Get Activities (GET `/api/admin/activities`)
- **Purpose:** Retrieve activities for admin dashboard
- **Rate Limit:** 60 requests/minute
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 50, max: 100)
  - `action` - Filter by action type
  - `path` - Filter by path
  - `startDate` - Filter by start date (ISO 8601)
  - `endDate` - Filter by end date (ISO 8601)
  - `sessionId` - Filter by session ID

#### 3. Export CSV (GET `/api/admin/activities/export/csv`)
- **Purpose:** Export activities as CSV file
- **Rate Limit:** 10 exports/minute
- **Query Parameters:** Same as Get Activities
- **Returns:** CSV file download

### Components

#### `components/ActivityTracker.tsx`
- Client-side component that automatically tracks page views and clicks
- Integrated into `app/layout.tsx`

#### `hooks/useActivityTracker.ts`
- React hooks for tracking:
  - `usePageViewTracking()` - Automatically track page views
  - `useClickTracking()` - Track click events
  - `useFormTracking()` - Track form submissions
  - `useActivityTracking()` - Generic activity tracking

#### `lib/analytics/tracker.ts`
- Core tracking functions
- Handles database operations
- Provides fallback logging if database is not configured

#### `middleware.ts`
- Next.js middleware for server-side page view tracking
- Runs on every request

### Admin Dashboard

Located at: `/admin/activities`

**Features:**
- View all activities in a table
- Filter by action type, path, date range
- Pagination support
- Export to CSV functionality
- Real-time activity count

## Usage

### Automatic Tracking

The system automatically tracks:
- **Page Views** - Via middleware and `ActivityTracker` component
- **Button Clicks** - Automatically tracked via `ActivityTracker`
- **Link Clicks** - Automatically tracked via `ActivityTracker`

### Manual Tracking

You can manually track activities using the hooks:

```typescript
import { useActivityTracking } from "@/hooks/useActivityTracker";

function MyComponent() {
  const { trackActivity } = useActivityTracking();

  const handleCustomAction = () => {
    trackActivity("custom_action", {
      customData: "value",
    });
  };

  return <button onClick={handleCustomAction}>Custom Action</button>;
}
```

### Track Form Submissions

```typescript
import { useFormTracking } from "@/hooks/useActivityTracker";

function MyForm() {
  const { trackFormSubmit } = useFormTracking();

  const handleSubmit = async () => {
    // Submit form...
    trackFormSubmit("my_form", {
      formData: "metadata",
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Data Structure

### Activity Object

```typescript
{
  id: string;
  timestamp: string; // ISO 8601
  action: "page_view" | "click" | "form_submit" | "download" | ...;
  path: string; // URL path
  sessionId: string;
  userId: string | null; // For authenticated users
  referrer: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null; // Custom data
}
```

## CSV Export Format

The CSV export includes the following columns:
- `id` - Activity ID
- `timestamp` - ISO 8601 timestamp
- `action` - Action type
- `path` - URL path
- `sessionId` - Session identifier
- `userId` - User ID (if authenticated)
- `referrer` - HTTP referrer
- `ipAddress` - IP address
- `userAgent` - User agent string
- `metadata` - JSON string of custom metadata

## Security

### Authentication (TODO)

Currently, admin endpoints are not protected. To secure them:

1. Implement authentication middleware
2. Add JWT token validation
3. Protect `/admin/*` routes

### Rate Limiting

- Tracking endpoint: 100 requests/minute
- Admin endpoints: 60 requests/minute
- CSV export: 10 exports/minute

### Data Privacy

- IP addresses are stored (consider GDPR compliance)
- User agents are stored
- Consider implementing data retention policies

## Performance Considerations

### Database Indexing

The schema includes indexes on:
- `timestamp` - For date range queries
- `action` - For filtering by action type
- `path` - For filtering by path
- `sessionId` - For session tracking
- `userId` - For user tracking (if authenticated)

### Caching

Consider implementing:
- Redis caching for frequently accessed data
- Query result caching
- Aggregated statistics caching

### Batch Processing

For high-traffic sites, consider:
- Batching activity writes
- Background job processing
- Queue-based tracking

## Monitoring

### Metrics to Monitor

- Activity volume per hour/day
- Most visited pages
- Most common actions
- Session duration
- Error rates

### Alerts

Consider setting up alerts for:
- Unusual activity spikes
- High error rates
- Database connection issues

## Troubleshooting

### Activities Not Showing Up

1. **Check Database Connection**
   - Verify `DATABASE_URL` is set correctly
   - Run `npx prisma migrate dev` to ensure schema is up to date

2. **Check Middleware**
   - Verify `middleware.ts` is in the root directory
   - Check Next.js logs for middleware errors

3. **Check API Endpoints**
   - Test `/api/analytics/track` endpoint
   - Check browser console for errors

### CSV Export Fails

1. **Check Rate Limits**
   - Verify you're not exceeding 10 exports/minute

2. **Check Database**
   - Ensure activities exist in database
   - Check database connection

3. **Check Permissions**
   - Verify file write permissions (if needed)

## Next Steps

1. ✅ Implement authentication for admin routes
2. ✅ Add data retention policies
3. ✅ Implement aggregated statistics
4. ✅ Add real-time activity feed
5. ✅ Implement activity search
6. ✅ Add activity charts/visualizations

## Support

For issues or questions:
- Check the logs in browser console
- Check server logs for API errors
- Review database connection status
- Verify Prisma schema is up to date

