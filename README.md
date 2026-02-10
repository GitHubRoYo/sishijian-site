# Sishijian Site

Next.js + Payload CMS monorepo-style app.

## One-click Deploy (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/GitHubRoYo/sishijian-site&env=DATABASE_URI,PAYLOAD_SECRET,SEED_SECRET,BLOB_READ_WRITE_TOKEN&envDescription=DATABASE_URI%3A%20Supabase%20Postgres%20URI%20(include%20sslmode%3Drequire).%0APAYLOAD_SECRET%3A%20random%2032%2B%20chars.%0ASEED_SECRET%3A%20random%2032%2B%20chars.%0ABLOB_READ_WRITE_TOKEN%3A%20from%20Vercel%20Blob%20Storage%20(recommended).&project-name=sishijian-site)

## Local Dev

```bash
pnpm install
pnpm dev
```

- Site: `http://localhost:3000/zh-HK`
- CMS: `http://localhost:3000/admin`

## Seed

```bash
pnpm seed
```

Default local users (see `pnpm seed` output):

- Admin: `admin@sishijian.com` / `admin123`
- Editor: `editor@sishijian.com` / `editor123`

## Deployment

See [docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md).
