/**
 * Shared CMS type definitions for sishijian-site.
 * All types are CMS-agnostic — used by both the Strapi adapter and page components.
 */

import type { Locale } from './i18n'

// ---------- Media ----------

export type Media = {
  id: string
  url?: string
  filename?: string
  alt?: string
  width?: number
  height?: number
  sizes?: Record<string, { url?: string; width?: number; height?: number }>
}

// ---------- Globals (Single Types) ----------

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
  logo?: Media | string
  favicon?: Media | string
  defaultSeo?: {
    title?: string
    description?: string
    ogImage?: Media | string
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
    backgroundImage?: Media | string
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
    logos?: Array<{ name?: string; logo?: Media | string }>
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

// ---------- Collections ----------

export type ServicePage = {
  id: string
  slug: 'brand-advertising' | 'culture-art'
  title?: string
  heroTitle?: string
  heroDescription?: string
  heroImage?: Media | string
  services?: Array<{
    anchorId: string
    title?: string
    description?: string
    content?: any
    icon?: string
    image?: Media | string
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
  cover?: Media | string
  businessType?: 'brand-advertising' | 'culture-art'
  industry?: Taxonomy | string
  industryTags?: Array<Taxonomy | string>
  summary?: string
  background?: any
  strategy?: any
  results?: any
  gallery?: Array<{ image?: Media | string; caption?: string }>
  servicesUsed?: Array<ServicePage | string>
  featured?: boolean
  status?: 'draft' | 'published'
  seo?: { title?: string; description?: string }
}

// ---------- API Response ----------

export type FindResponse<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page?: number
  hasPrevPage?: boolean
  hasNextPage?: boolean
  prevPage?: number | null
  nextPage?: number | null
}
