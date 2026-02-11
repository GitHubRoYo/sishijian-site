# Sishijian Site (四時鑑)

Next.js 16 frontend + Strapi 5 CMS.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS 3.4 + Radix UI
- **CMS**: Strapi 5 (separate project: `sishijian-cms`)
- **i18n**: `next-intl` (zh-HK, en, zh-Hans)
- **Deployment**: Vercel (frontend) + Strapi Cloud (CMS)

## Local Dev

```bash
# 1. Start Strapi CMS (separate terminal)
cd /path/to/sishijian-cms
pnpm develop

# 2. Start frontend
cd /path/to/sishijian-site
pnpm install
pnpm dev
```

- Site: `http://localhost:3000/zh-HK`
- Strapi Admin: `http://localhost:1337/admin`

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_STRAPI_URL` | Yes | Strapi API URL (e.g. `http://localhost:1337`) |
| `STRAPI_API_TOKEN` | Yes | Strapi API token (in `.env.local`) |
| `NEXT_PUBLIC_SERVER_URL` | No | Frontend URL (auto-detected on Vercel) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (site)/[locale]/    # Localized pages (home, cases, services, about, contact)
│   ├── api/                # API routes (leads, subscriptions)
│   └── health/             # Health check endpoint
├── components/             # React components (UI + features)
├── lib/
│   ├── api.ts              # CMS API entry point
│   ├── strapiApi.ts        # Strapi REST adapter
│   ├── types.ts            # CMS type definitions
│   ├── defaultContent.ts   # Fallback content when CMS is empty
│   └── i18n.ts             # Locale configuration
└── messages/               # i18n translation files
```

## Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_STRAPI_URL` = your Strapi production URL
   - `STRAPI_API_TOKEN` = your Strapi API token
3. Deploy

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads` | POST | Contact form / lead capture submissions |
| `/api/subscriptions` | POST | Newsletter email subscriptions |
| `/health` | GET | Health check (Strapi connectivity) |
