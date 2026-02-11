# Sishijian Site - Handover Documentation

Guide for developers (or AI agents) taking over this project.

## 1. Project Overview

The Sishijian website showcases the company's "Brand Advertising" and "Culture Art" business lines with a premium, responsive design.

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 3.4 + Radix UI
- **CMS**: Strapi 5 (separate project at `sishijian-cms`)
- **i18n**: `next-intl` (zh-HK, en, zh-Hans)

## 2. Architecture

### Data Flow
```
Page Components (src/app/[locale]/*)
  ↓ import from
@/lib/api.ts (unified entry point)
  ↓ calls
@/lib/strapiApi.ts (Strapi 5 REST adapter)
  ↓ fetch
Strapi 5 (localhost:1337 or production URL)
  ↓ if CMS returns empty
@/lib/defaultContent.ts (hardcoded fallback content)
```

### Type Definitions
All CMS types are in `src/lib/types.ts`:
- `Media` — media object (images etc.)
- `NavigationGlobal`, `SiteSettingsGlobal`, `HomepageGlobal` — single types
- `CaseDoc`, `ServicePage`, `Taxonomy` — collection types
- `FindResponse<T>` — paginated API response

### API Routes
- `POST /api/leads` — forwards to Strapi Lead collection
- `POST /api/subscriptions` — forwards to Strapi subscriptions

## 3. Design System

### Typography
- **Headings**: `Noto Serif SC` (Google Fonts)
- **Body**: `Inter` (Google Fonts)

### Color Palette (CSS variables in `globals.css`)
- **Primary (Crimson)**: `hsl(348 50% 30%)`
- **Secondary (Gold)**: `hsl(40 42% 48%)`
- **Background (Dark)**: `hsl(28 14% 5%)`
- **Surface**: `hsl(40 20% 98%)`

### Key CSS Utilities
- `.glass` — premium glassmorphism effect
- `.hover-lift` — smooth elevation on hover
- `.text-gradient-gold`, `.text-gradient-crimson`
- `.section-dark`, `.section-warm`, `.section-accent`

## 4. Core Components

| Component | Location | Description |
|-----------|----------|-------------|
| Header | `src/components/layout/Header.tsx` | Sticky nav, locale switching, mobile menu |
| Footer | `src/components/layout/Footer.tsx` | Newsletter, social links, navigation |
| BrandWall | `src/components/brand-wall/BrandWall.tsx` | Partner logos grid (hardcoded in `brandWall.data.ts`) |
| CasesExplorer | `src/components/cases/CasesExplorer.tsx` | Client-side filtering by industry/type |
| ContactForm | `src/components/contact/ContactForm.tsx` | Contact form → POST /api/leads |
| LeadCaptureDialog | `src/components/leads/LeadCaptureDialog.tsx` | Modal lead form → POST /api/leads |
| NewsletterForm | `src/components/newsletter/NewsletterForm.tsx` | Email signup → POST /api/subscriptions |
| ServicePageTemplate | `src/components/services/ServicePageTemplate.tsx` | Reusable service detail page |

## 5. Development

### Getting Started
```bash
# Frontend
cd sishijian-site
pnpm install
pnpm dev

# CMS (separate terminal)
cd sishijian-cms
pnpm develop
```

### Key Directories
- `src/app/(site)/[locale]` — page routes (localized)
- `src/components` — UI components (Radix UI + custom)
- `src/lib` — utilities, API adapters, i18n config
- `public/assets` — static assets (images, logos)

### Environment Variables
- `NEXT_PUBLIC_STRAPI_URL` — Strapi API URL
- `STRAPI_API_TOKEN` — Strapi API token (in `.env.local`)
- `NEXT_PUBLIC_SERVER_URL` — frontend URL

## 6. Known Issues / TODOs

- **About page**: 100% hardcoded, not connected to CMS
- **BrandWall**: Partner logos hardcoded in `brandWall.data.ts`, not from CMS
- **ServicePageTemplate**: Has hardcoded fallback bullets, should come from CMS
- **Strapi Subscription collection**: Needs to be created in Strapi if newsletter is needed
- **Image placeholders**: Some images use `/assets/seed/...` placeholders
- **Analytics**: No Google Analytics or tracking integration

## 7. Deployment

- **Frontend**: Vercel (auto-deploys on push to `main`)
- **CMS**: Strapi Cloud or self-hosted

Required Vercel env vars:
- `NEXT_PUBLIC_STRAPI_URL` = Strapi production URL
- `STRAPI_API_TOKEN` = Strapi API token
