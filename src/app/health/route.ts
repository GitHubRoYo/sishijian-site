import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function checkDb(connectionString: string) {
  try {
    const pg = await import('pg')
    const client = new pg.Client({ connectionString })
    await client.connect()
    await client.query('select 1')
    await client.end()
    return { ok: true as const }
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function GET() {
  const hasDatabaseUri = Boolean(process.env.DATABASE_URI)
  const hasPayloadSecret = Boolean(process.env.PAYLOAD_SECRET)
  const hasSeedSecret = Boolean(process.env.SEED_SECRET)
  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  const inferredServerURL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null

  const db = hasDatabaseUri ? await checkDb(process.env.DATABASE_URI as string) : { ok: false as const, error: 'DATABASE_URI missing' }

  return NextResponse.json({
    ok: db.ok && hasPayloadSecret,
    env: {
      DATABASE_URI: hasDatabaseUri,
      PAYLOAD_SECRET: hasPayloadSecret,
      SEED_SECRET: hasSeedSecret,
      BLOB_READ_WRITE_TOKEN: hasBlobToken,
      PAYLOAD_PUBLIC_SERVER_URL: Boolean(process.env.PAYLOAD_PUBLIC_SERVER_URL),
      NEXT_PUBLIC_SERVER_URL: Boolean(process.env.NEXT_PUBLIC_SERVER_URL),
      VERCEL_URL: Boolean(process.env.VERCEL_URL),
    },
    inferred: {
      serverURL: inferredServerURL,
    },
    db,
  })
}
