/**
 * Strapi API adapter — 与 payloadApi.ts 接口对齐
 * 用于对接 sishijian-cms (Strapi 5) 的 REST API
 */

import type { Locale } from './i18n'

// Re-export shared types from payloadApi so callers can stay type-compatible
export type {
  PayloadMedia,
  NavigationGlobal,
  SiteSettingsGlobal,
  HomepageGlobal,
  ServicePage,
  Taxonomy,
  CaseDoc,
} from './payloadApi'

import type {
  PayloadMedia,
  NavigationGlobal,
  SiteSettingsGlobal,
  HomepageGlobal,
  ServicePage,
  Taxonomy,
  CaseDoc,
} from './payloadApi'

// ---------- helpers ----------

const getStrapiURL = () => {
  return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
}

/** Map our locale codes to Strapi locale codes */
const mapLocale = (locale: Locale): string => {
  // Strapi 5 uses standard BCP-47 tags; adjust if Strapi is configured differently
  const map: Record<string, string> = {
    'zh-HK': 'zh-Hant-HK',
    'zh-Hans': 'zh-Hans',
    en: 'en',
  }
  return map[locale] || locale
}

/**
 * Strapi 5 wraps responses in { data: { id, attributes } } (single) or
 * { data: [{ id, attributes }], meta: { pagination } } (collection).
 * This helper flattens it into the shape our frontend expects.
 */
function flattenAttributes<T>(entry: any): T {
  if (!entry) return {} as T
  if (entry.data === null) return {} as T

  const raw = entry.data ?? entry

  // Collection (array)
  if (Array.isArray(raw)) {
    return raw.map((item: any) => ({
      id: String(item.id),
      ...item.attributes,
      ...flattenRelations(item.attributes),
    })) as unknown as T
  }

  // Single entry
  return {
    id: String(raw.id),
    ...raw.attributes,
    ...flattenRelations(raw.attributes),
  } as T
}

/** Recursively flatten nested relations (one level deep) */
function flattenRelations(attrs: Record<string, any> | undefined): Record<string, any> {
  if (!attrs) return {}
  const out: Record<string, any> = {}
  for (const [key, val] of Object.entries(attrs)) {
    if (val && typeof val === 'object' && 'data' in val) {
      // Relation field
      if (Array.isArray(val.data)) {
        out[key] = val.data.map((d: any) => ({ id: String(d.id), ...d.attributes }))
      } else if (val.data) {
        out[key] = { id: String(val.data.id), ...val.data.attributes }
      } else {
        out[key] = null
      }
    }
  }
  return out
}

// ---------- public API (mirrors payloadApi) ----------

type FindResponse<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page?: number
  hasPrevPage?: boolean
  hasNextPage?: boolean
}

/**
 * Fetch a Strapi Single Type (equivalent to Payload Global).
 * Strapi endpoint: GET /api/{slug}?populate=deep&locale=xx
 */
export async function strapiGetGlobal<T>(
  slug: string,
  locale: Locale,
  depth: number = 2,
): Promise<T> {
  const base = getStrapiURL()
  const strapiLocale = mapLocale(locale)
  const populateParam = depth >= 2 ? 'populate=*' : ''
  const url = `${base}/api/${slug}?${populateParam}&locale=${strapiLocale}`

  try {
    const res = await fetch(url, { next: { revalidate: 0 } })
    if (!res.ok) {
      console.warn(`[strapiGetGlobal] ${slug} returned ${res.status}, returning empty object`)
      return {} as T
    }
    const json = await res.json()
    return flattenAttributes<T>(json)
  } catch (err) {
    console.warn(`[strapiGetGlobal] Failed to fetch ${slug}:`, err)
    return {} as T
  }
}

/**
 * Fetch a Strapi Collection Type (equivalent to Payload find).
 * Strapi endpoint: GET /api/{collection}?populate=*&locale=xx&pagination[limit]=N&sort=field:dir
 */
export async function strapiFind<T>(
  collection: string,
  locale: Locale,
  qs: Record<string, string | number | boolean | undefined> = {},
): Promise<FindResponse<T>> {
  const base = getStrapiURL()
  const strapiLocale = mapLocale(locale)
  const params = new URLSearchParams()
  params.set('populate', '*')
  params.set('locale', strapiLocale)

  // Map Payload-style query params to Strapi filters
  for (const [key, val] of Object.entries(qs)) {
    if (val === undefined) continue
    // e.g. 'where[status][equals]' → 'filters[status][$eq]'
    const filterMatch = key.match(/^where\[(.+?)\]\[equals\]$/)
    if (filterMatch) {
      params.set(`filters[${filterMatch[1]}][$eq]`, String(val))
      continue
    }
    if (key === 'limit') {
      params.set('pagination[limit]', String(val))
      continue
    }
    if (key === 'sort') {
      // Payload sort: '-updatedAt' → Strapi sort: 'updatedAt:desc'
      const sortVal = String(val)
      if (sortVal.startsWith('-')) {
        params.set('sort', `${sortVal.slice(1)}:desc`)
      } else {
        params.set('sort', `${sortVal}:asc`)
      }
      continue
    }
    if (key === 'depth') continue // handled by populate
    params.set(key, String(val))
  }

  const url = `${base}/api/${collection}?${params.toString()}`

  try {
    const res = await fetch(url, { next: { revalidate: 0 } })
    if (!res.ok) {
      console.warn(`[strapiFind] ${collection} returned ${res.status}, returning empty`)
      return { docs: [], totalDocs: 0, limit: 25, totalPages: 0 }
    }
    const json = await res.json()
    const data = Array.isArray(json.data) ? json.data : []
    const docs = data.map((item: any) => ({
      id: String(item.id),
      ...item.attributes,
      ...flattenRelations(item.attributes),
    })) as T[]

    const meta = json.meta?.pagination || {}
    return {
      docs,
      totalDocs: meta.total ?? docs.length,
      limit: meta.pageSize ?? 25,
      totalPages: meta.pageCount ?? 1,
      page: meta.page ?? 1,
    }
  } catch (err) {
    console.warn(`[strapiFind] Failed to fetch ${collection}:`, err)
    return { docs: [], totalDocs: 0, limit: 25, totalPages: 0 }
  }
}

/**
 * Build full media URL from Strapi media field.
 * Strapi stores relative URLs like /uploads/file.jpg
 */
export const strapiMediaURL = (media?: PayloadMedia | string | null): string | null => {
  if (!media) return null
  if (typeof media === 'string') {
    if (media.startsWith('http')) return media
    if (media.startsWith('/assets/')) return media // local public assets
    return `${getStrapiURL()}${media}`
  }
  if (media.url) {
    if (media.url.startsWith('http')) return media.url
    if (media.url.startsWith('/assets/')) return media.url // local public assets
    return `${getStrapiURL()}${media.url}`
  }
  return null
}
