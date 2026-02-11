import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const hasStrapiUrl = Boolean(process.env.NEXT_PUBLIC_STRAPI_URL)
  const hasStrapiToken = Boolean(process.env.STRAPI_API_TOKEN)

  // Quick check: can we reach Strapi?
  let strapiOk = false
  if (hasStrapiUrl) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/content-type-builder/content-types`, {
        signal: AbortSignal.timeout(5000),
      })
      strapiOk = res.ok
    } catch {
      strapiOk = false
    }
  }

  return NextResponse.json({
    ok: hasStrapiUrl,
    cms: 'strapi',
    env: {
      NEXT_PUBLIC_STRAPI_URL: hasStrapiUrl,
      STRAPI_API_TOKEN: hasStrapiToken,
      NEXT_PUBLIC_SERVER_URL: Boolean(process.env.NEXT_PUBLIC_SERVER_URL),
      VERCEL_URL: Boolean(process.env.VERCEL_URL),
    },
    strapi: {
      reachable: strapiOk,
    },
  })
}
