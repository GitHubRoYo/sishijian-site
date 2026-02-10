# Deploy to Vercel (GitHub + Vercel)

This project runs **Next.js + Payload CMS** in one app. For production you need:

- A **Postgres database** (NOT Supabase if you don’t want; any Postgres is fine)
- A **Payload secret**
- (Required on Vercel) **Object storage** for uploads (Vercel is serverless + ephemeral disk)

If you are OK with Supabase, you can use **Supabase Postgres** as the database.

## 1) Push to GitHub

If you already have a repo, skip to the Vercel section.

```bash
git status
```

## 2) Create Vercel project

1. Go to Vercel Dashboard → **Add New…** → **Project**
2. Import the GitHub repo
3. Framework preset: **Next.js**
4. Build command: `pnpm build`
5. Output: default

## 3) Required environment variables

In Vercel → Project → **Settings** → **Environment Variables** (Production + Preview):

### Database

- `DATABASE_URI` = your Postgres connection string

Notes:
- You can use **Vercel Postgres**, **Neon**, **Railway**, **RDS**, etc.
- Don’t use `localhost` in Vercel env.

#### Supabase example

In Supabase → Project Settings → Database → Connection string (URI), use the **Transaction pooler** for serverless when available.

Example (replace values):

```text
postgresql://postgres:<PASSWORD>@<HOST>:6543/postgres?sslmode=require
```

### Payload / App URLs

- `PAYLOAD_SECRET` = long random string
- `PAYLOAD_PUBLIC_SERVER_URL` = `https://<your-vercel-domain>`
- `NEXT_PUBLIC_SERVER_URL` = `https://<your-vercel-domain>`

### Locales

- `NEXT_PUBLIC_DEFAULT_LOCALE` = `zh-HK`
- `NEXT_PUBLIC_LOCALES` = `zh-HK,en,zh-Hans`

### CMS users (recommended)

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `EDITOR_EMAIL`
- `EDITOR_PASSWORD`

In production you usually want:

- `RESET_SEED_USERS` = `false`

## 4) First-time seed (recommended)

Vercel doesn’t run `pnpm seed` automatically. Do one of the following:

### Option A (recommended): seed from your local machine

1. Set a local `.env` with **production DB** `DATABASE_URI` and server url
2. Run:

```bash
pnpm seed
```

This will create initial content + admin/editor users.

If you use Supabase, make sure your `DATABASE_URI` points to Supabase and includes `sslmode=require`.

### Option B (recommended on locked-down DB): run seed in Vercel

This repo includes a protected route: `GET /seed?token=...`.

1. In Vercel env vars, set:
   - `SEED_SECRET` = long random string
2. After the first deploy, open:

`https://<your-domain>/seed?token=<SEED_SECRET>`

This will initialize tables (if needed) and seed default content into the configured `DATABASE_URI`.

## 5) Media uploads (Vercel Blob)

This repo is configured to use **Vercel Blob** for the `media` collection when `BLOB_READ_WRITE_TOKEN` is set.

1. In Vercel → your project → **Storage** → **Create Database** → **Blob**
2. Vercel will add `BLOB_READ_WRITE_TOKEN` to your project env automatically (or copy it from the Blob “Quick Start” panel)
3. Ensure `BLOB_READ_WRITE_TOKEN` exists in **Production** env

Important for seeding:

- If you run `pnpm seed` from your local machine to seed production DB, also set `BLOB_READ_WRITE_TOKEN` locally.
- Otherwise the seed process will upload files to your local disk, and production won’t be able to serve them.

### Option B: seed manually in CMS

Log into `/admin` and create content manually.

## 6) Notes

Vercel has server upload limits. This project enables client-side uploads for Blob to bypass common serverless limits.

## 7) URLs to verify

- Site: `https://<your-domain>/zh-HK`
- CMS: `https://<your-domain>/admin`
- API: `https://<your-domain>/api/*`
