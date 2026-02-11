import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { name, company, phone, email, businessInterest, industry, message, partnershipType, source } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Forward to Strapi Lead collection
    const strapiBody = {
      data: {
        name: name.trim(),
        company: company || null,
        phone: phone || null,
        email: email || null,
        businessInterest: Array.isArray(businessInterest) ? businessInterest : [],
        industry: industry || null,
        message: message || null,
        partnershipType: partnershipType || null,
        source: source || null,
        status: 'new',
      },
    }

    const res = await fetch(`${STRAPI_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify(strapiBody),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[/api/leads] Strapi returned ${res.status}:`, text)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/leads] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
