# Sishijian Site - Handover Documentation

This document serves as a comprehensive guide for developers taking over the Sishijian website project. It details the technical stack, design system, component architecture, and CMS integration.

## 1. Project Overview

The Sishijian website is a Next.js application designed to showcase the company's "Brand Advertising" and "Culture Art" business lines. It features a premium, responsive design with a focus on visual storytelling and seamless user experience.

- **Frontend Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Radix UI
- **CMS**: Hybrid support for Payload CMS (legacy/current) and Strapi v5 (future/migration target)
- **Internationalization**: `next-intl` (zh-HK, en, zh-CN)

## 2. Design System

The design system is built on a custom Tailwind configuration, emphasizing a "Premium Cultural" aesthetic.

### Typography
- **Headings**: `Noto Serif SC` (Google Fonts) - Elegant, traditional feel for titles.
- **Body**: `Inter` (Google Fonts) - Clean, modern readability for text.
- **Configuration**: Managed via `next/font/google` in `src/app/(site)/layout.tsx` and CSS variables `--font-serif` / `--font-sans`.

### Color Palette (`globals.css`)
- **Primary (Crimson)**: `hsl(348 50% 30%)` - Representing vitality and heritage ("Cinnabar").
- **Secondary (Gold)**: `hsl(40 42% 48%)` - Representing quality and prestige.
- **Background (Dark)**: `hsl(28 14% 5%)` - Deep, warm charcoal for immersive sections.
- **Surface**: `hsl(40 20% 98%)` - Warm off-white for light sections.

### Key Utilities
- **Glass Effect**: `.glass` - Premium backdrop blur with subtle borders. w/ Dark mode variants.
- **Hover Lift**: `.hover-lift` - Smooth elevation and shadow on hover.
- **Text Gradients**: `.text-gradient-gold`, `.text-gradient-crimson`.
- **Animations**: `animate-slide-up`, `animate-fade-in`, `animate-float` (see `globals.css`).

## 3. Core Components

- **Header (`src/components/layout/Header.tsx`)**
  - Responsive, sticky header with scroll-aware glass effect.
  - Handles locale switching and mobile menu.
  
- **Footer (`src/components/layout/Footer.tsx`)**
  - Dynamic content from `site-settings` globally.
  - Includes newsletter signup and social links.

- **BrandWall (`src/components/brand-wall/BrandWall.tsx`)**
  - Grid display for partner logos with category-based styling (Gold/Red/Blue themes).
  
- **CasesExplorer (`src/components/cases/CasesExplorer.tsx`)**
  - Filterable portfolio grid (by Industry and Business Type).
  - Uses URL state for shareable filters? (Currently local state, potential enhancement).

- **ConsultButton (`src/components/leads/ConsultButton.tsx`)**
  - Unified CTA button that opens the contact form or redirects.
  - Supports tracking source parameters.

## 4. CMS Architecture

The project is currently in a transition phase between Payload CMS and Strapi.

### API Layer
- **Unified Interface**: `src/lib/api.ts`
- **Adapter**: `src/lib/strapiApi.ts`
- **Switching**: Toggle `NEXT_PUBLIC_CMS_PROVIDER` in `.env` (`payload` or `strapi`).

### Data Models
- **Single Types**: `SiteSettings`, `Homepage`, `Navigation`
- **Collections**: `Cases`, `ServicePages`, `Taxonomies`, `Leads`

### Strapi Setup (Future)
- Schemas have been automatically generated in `sishijian-cms/src/api`.
- Run `npm run develop` in `sishijian-cms` to initialize.
- **Action Required**: Create Admin user and configure "Public" role permissions for API access.

## 5. Development Guidelines

### Getting Started
```bash
# Frontend
cd sishijian-site
npm install
npm run dev

# CMS (Strapi)
cd sishijian-cms
npm run develop
```

### Key Directories
- **`src/app/(site)/[locale]`**: Page routes (localized).
- **`src/components`**: UI components (shadcn/ui + custom).
- **`src/lib`**: Utilities, API adapters, i18n config.
- **`public/assets`**: Static assets (images, logos, etc).

### Deployment
- **Frontend**: Vercel/Netlify/Vercel is recommended. Ensure `NEXT_PUBLIC_CMS_PROVIDER` and `NEXT_PUBLIC_STRAPI_URL` are set.
- **CMS**: Strapi Cloud or self-hosted VPS (Docker).

## 6. Known Issues / TODOs
- **Lenis Scroll**: Smooth scrolling is currently implemented via CSS `scroll-behavior: smooth`. Consider adding Lenis library for more advanced control if needed.
- **Image placeholders**: Some images are currently placeholders (`/assets/seed/...`). Replace with real assets before production launch.
