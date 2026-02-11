import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, locale, source } = body

    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Check if email already exists in Strapi
    const checkUrl = `${STRAPI_URL}/api/subscriptions?filters[email][$eq]=${encodeURIComponent(email.trim())}`
    const checkRes = await fetch(checkUrl, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
    })

    if (checkRes.ok) {
      const checkData = await checkRes.json()
      if (checkData.data?.length > 0) {
        return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
      }
    }

    // Create subscription in Strapi
    const strapiBody = {
      data: {
        email: email.trim(),
        locale: locale || 'zh-HK',
        source: source || null,
        subscribedAt: new Date().toISOString(),
      },
    }

    const res = await fetch(`${STRAPI_URL}/api/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify(strapiBody),
    })

    if (!res.ok) {
      const text = await res.text()
      // Handle Strapi unique constraint error
      if (res.status === 400 && /unique/i.test(text)) {
        return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
      }
      console.error(`[/api/subscriptions] Strapi returned ${res.status}:`, text)
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/subscriptions] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
