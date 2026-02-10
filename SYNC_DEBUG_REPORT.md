# Backend-Frontend Sync Debug Report

## Sync Mechanism

The sishijian-site uses **Next.js App Router** with **Payload CMS** in a single Next.js application.
Both the frontend and backend share the same process and database.

### How Data Flows

1. **Backend (Payload CMS)**: Admin panel at `/admin` writes directly to PostgreSQL via Payload ORM
2. **API Layer**: Payload auto-generates REST API at `/api/*` and GraphQL at `/graphql`
3. **Frontend**: Server Components fetch from the local API using `payloadApi.ts` helper functions
4. **Caching**: All API calls use `{ next: { revalidate: 0 } }` (no caching) and pages use `dynamic = 'force-dynamic'`

### Key API Functions (src/lib/payloadApi.ts)

- `payloadGetGlobal(slug, locale, depth)` - Fetches globals (homepage, navigation, site-settings)
- `payloadFind(collection, locale, querystring)` - Fetches collection documents (cases, taxonomies, etc.)
- `mediaURL(media)` - Extracts URL from Payload media objects

### Base URL Resolution

Priority order:
1. `NEXT_PUBLIC_SERVER_URL` environment variable
2. `PAYLOAD_PUBLIC_SERVER_URL` environment variable
3. `VERCEL_URL` (auto-set on Vercel deployments)
4. Fallback: `http://localhost:3000`

## Sync Verification

### Why It Works

- **Same process**: Payload CMS and Next.js run in the same Node.js process
- **No caching**: `revalidate: 0` ensures every page render fetches fresh data
- **Force dynamic**: `export const dynamic = 'force-dynamic'` prevents static generation
- **Direct DB**: Payload writes to PostgreSQL; API reads from same DB immediately

### Common Issues & Solutions

| Issue | Cause | Fix |
|-------|-------|-----|
| Stale content after edit | Browser cache | Hard refresh (Ctrl+Shift+R) |
| 404 on API calls | Wrong `NEXT_PUBLIC_SERVER_URL` | Ensure `.env` has `NEXT_PUBLIC_SERVER_URL=http://localhost:3000` |
| Content not appearing | Draft status | Ensure content is set to "published" status in admin |
| Images not loading | Missing media files | Check `/media` directory or Vercel Blob configuration |
| CORS errors (external) | API accessed from different origin | Set proper `PAYLOAD_PUBLIC_SERVER_URL` |

### Payload Collections & Status

- **Cases**: Have `status` field (draft/published). Only published cases appear on frontend.
- **Globals** (Homepage, Navigation, SiteSettings): Always live - changes visible immediately on refresh.
- **Service Pages**: Always live.
- **Media**: Uploaded files served from `/api/media/file/` or Vercel Blob storage.

## Verification Steps

1. Login to admin at `http://localhost:3000/admin`
2. Navigate to Globals > Homepage
3. Edit any text field (e.g., Hero title)
4. Click Save
5. Open `http://localhost:3000/zh-HK` in browser
6. Verify the change appears (may need page refresh due to client-side navigation)

## Environment Variables Required for Sync

```
DATABASE_URI=postgresql://...          # PostgreSQL connection
PAYLOAD_SECRET=...                     # CMS encryption key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000  # Base URL for API calls
```
