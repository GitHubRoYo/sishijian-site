# CMS Migration Guide & Architecture Overview

## Overview
This project has migrated from **Payload CMS** (embedded) to **Strapi CMS** (headless). To ensure high availability and a seamless user experience even when the CMS is offline or empty, a **Frontend Fallback System** has been implemented.

## Architecture Change

### Old Architecture (Payload)
- **CMS**: Payload CMS (embedded in Next.js app).
- **Database**: PostgreSQL (required for build & runtime).
- **Issue**: Deployment on Vercel failed due to missing database connection during build, and high complexity in managing embedded CMS state.

### New Architecture (Strapi + Fallback)
- **CMS**: Strapi v5 (Headless, hosted separately).
- **Frontend**: Next.js 14 (Deployed on Vercel).
- **Data Flow**:
  1. Frontend attempts to fetch data from Strapi API via `src/lib/strapiApi.ts`.
  2. If Strapi returns data, it is used.
  3. If Strapi returns empty/error, or if data is missing, the frontend falls back to `src/lib/defaultContent.ts`.

## Fallback System
The fallback system is the source of truth for "Demo Mode". It ensures the website looks populated and professional immediately after deployment.

- **Location**: `src/lib/defaultContent.ts`
- **Coverage**:
  - **Navigation**: Header & Footer menus.
  - **Homepage**: Hero, Services overview, Featured Cases.
  - **Service Pages**: Full content for "Brand Advertising" and "Culture Art".
  - **Case Studies**: 3 complete demo case studies with details.
  - **Site Settings**: Contact info, SEO defaults.

## Key Files
- `src/lib/api.ts`: Unified entry point. Switches between `strapiApi` and `payloadApi` (deprecated) based on env.
- `src/lib/strapiApi.ts`: Adapter for Strapi v5 REST API. Handles error suppression (returns empty objects instead of throwing).
- `src/lib/defaultContent.ts`: Contains all hardcoded fallback data and rich text generators.

## How to Update Content
1. **CMS Content**: Log in to Strapi and publish content. It will automatically override the fallbacks.
2. **Fallback Content**: Edit `src/lib/defaultContent.ts` to change the default "Demo" state.

## Assets
- Demo images are stored in `public/assets/seed/`.
- CMS images are strictly URLs from the Strapi media library.
