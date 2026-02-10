import type { Locale } from './i18n'

type PayloadFindResponse<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page?: number
  pagingCounter?: number
  hasPrevPage?: boolean
  hasNextPage?: boolean
  prevPage?: number | null
  nextPage?: number | null
}

export type PayloadMedia = {
  id: string
  url?: string
  filename?: string
  alt?: string
  width?: number
  height?: number
  sizes?: Record<string, { url?: string; width?: number; height?: number }>
}

export type NavigationGlobal = {
  headerNav?: Array<{
    label: string
    url: string
    order?: number
    children?: Array<{
      label: string
      url: string
      description?: string
    }>
  }>
  ctaButton?: {
    label?: string
    url?: string
  }
  footerNav?: Array<{
    title: string
    links?: Array<{ label: string; url: string }>
  }>
  footerBottom?: {
    copyright?: string
    legalLinks?: Array<{ label?: string; url?: string }>
  }
}

export type SiteSettingsGlobal = {
  companyNameShort?: string
  companyName?: string
  domain?: string
  logo?: PayloadMedia | string
  favicon?: PayloadMedia | string
  defaultSeo?: {
    title?: string
    description?: string
    ogImage?: PayloadMedia | string
  }
  contact?: {
    address?: string
    phone?: string
    email?: string
    businessHours?: string
  }
  social?: {
    facebook?: string
    instagram?: string
    xiaohongshu?: string
    wechat?: string
    linkedin?: string
  }
  languageSettings?: {
    availableLocales?: Array<{ code?: string; label?: string }>
  }
}

export type HomepageGlobal = {
  hero?: {
    title?: string
    subtitle?: string
    description?: string
    backgroundImage?: PayloadMedia | string
    ctaPrimary?: { label?: string; url?: string }
    ctaSecondary?: { label?: string; url?: string }
  }
  services?: {
    title?: string
    description?: string
    items?: Array<{ title?: string; description?: string; icon?: string; url?: string }>
  }
  featuredCases?: {
    title?: string
    description?: string
    cases?: any[]
  }
  partners?: {
    title?: string
    description?: string
    logos?: Array<{ name?: string; logo?: PayloadMedia | string }>
  }
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    buttonUrl?: string
  }
  seo?: {
    title?: string
    description?: string
  }
}

export type ServicePage = {
  id: string
  slug: 'brand-advertising' | 'culture-art'
  title?: string
  heroTitle?: string
  heroDescription?: string
  heroImage?: PayloadMedia | string
  services?: Array<{
    anchorId: string
    title?: string
    description?: string
    content?: any
    icon?: string
    image?: PayloadMedia | string
  }>
  ideallySuitedFor?: Array<{ item?: string }>
  quickCheck?: Array<{ condition?: string; result?: string }>
  faq?: Array<{ question?: string; answer?: any }>
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  seo?: { title?: string; description?: string }
}

export type Taxonomy = {
  id: string
  slug: string
  type: 'industry' | 'business-type' | 'intangible-heritage'
  name?: string
  description?: string
  icon?: string
  order?: number
}

export type CaseDoc = {
  id: string
  slug: string
  title?: string
  cover?: PayloadMedia | string
  businessType?: 'brand-advertising' | 'culture-art'
  industry?: Taxonomy | string
  industryTags?: Array<Taxonomy | string>
  summary?: string
  background?: any
  strategy?: any
  results?: any
  gallery?: Array<{ image?: PayloadMedia | string; caption?: string }>
  servicesUsed?: Array<ServicePage | string>
  featured?: boolean
  status?: 'draft' | 'published'
  seo?: { title?: string; description?: string }
}

const getBaseURL = () => {
  const fromEnv = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL
  if (fromEnv) return fromEnv
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

const withQS = (pathname: string, qs: Record<string, string | number | boolean | undefined>) => {
  const url = new URL(pathname, getBaseURL())
  for (const [k, v] of Object.entries(qs)) {
    if (v === undefined) continue
    url.searchParams.set(k, String(v))
  }
  return url.toString()
}

export async function payloadGetGlobal<T>(slug: string, locale: Locale, depth: number = 2): Promise<T> {
  try {
    const url = withQS(`/api/globals/${slug}`, { locale, depth })
    const res = await fetch(url, { next: { revalidate: 0 } })
    if (!res.ok) {
      console.warn(`[payloadGetGlobal] ${slug} returned ${res.status}, returning empty`)
      return {} as T
    }
    return res.json()
  } catch (err) {
    console.warn(`[payloadGetGlobal] Failed to fetch ${slug}:`, err)
    return {} as T
  }
}

export async function payloadFind<T>(
  collection: string,
  locale: Locale,
  qs: Record<string, string | number | boolean | undefined> = {},
): Promise<PayloadFindResponse<T>> {
  try {
    const url = withQS(`/api/${collection}`, { locale, depth: 2, ...qs })
    const res = await fetch(url, { next: { revalidate: 0 } })
    if (!res.ok) {
      console.warn(`[payloadFind] ${collection} returned ${res.status}, returning empty`)
      return { docs: [], totalDocs: 0, limit: 25, totalPages: 0 }
    }
    return res.json()
  } catch (err) {
    console.warn(`[payloadFind] Failed to fetch ${collection}:`, err)
    return { docs: [], totalDocs: 0, limit: 25, totalPages: 0 }
  }
}

export const mediaURL = (media?: PayloadMedia | string | null): string | null => {
  if (!media) return null
  if (typeof media === 'string') return media
  if (media.url) return media.url
  return null
}
