/**
 * Unified CMS API entry point.
 *
 * Reads `NEXT_PUBLIC_CMS_PROVIDER` to decide whether to use Payload or Strapi.
 *   - "strapi"  → routes to strapiApi.ts
 *   - "payload" (default) → routes to payloadApi.ts
 *
 * All pages should import from this file instead of payloadApi / strapiApi directly.
 */

import type { Locale } from './i18n'

// Re-export all shared types so pages only need one import
export type {
    PayloadMedia,
    NavigationGlobal,
    SiteSettingsGlobal,
    HomepageGlobal,
    ServicePage,
    Taxonomy,
    CaseDoc,
} from './payloadApi'

import {
    payloadGetGlobal,
    payloadFind,
    mediaURL as payloadMediaURL,
} from './payloadApi'

import {
    strapiGetGlobal,
    strapiFind,
    strapiMediaURL,
} from './strapiApi'

// ---------- provider detection ----------

const provider = (process.env.NEXT_PUBLIC_CMS_PROVIDER || 'strapi').toLowerCase()
const isStrapi = provider === 'strapi'

// ---------- exported unified functions ----------

type FindResponse<T> = {
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

/**
 * Fetch a CMS global / single-type.
 * Slug should be the Payload global slug (e.g. 'site-settings', 'navigation', 'homepage').
 * When Strapi is active the same slug is used; configure Strapi single-type API IDs to match.
 */
export async function getGlobal<T>(slug: string, locale: Locale, depth: number = 2): Promise<T> {
    if (isStrapi) {
        return strapiGetGlobal<T>(slug, locale, depth)
    }
    return payloadGetGlobal<T>(slug, locale, depth)
}

/**
 * Fetch a CMS collection.
 */
export async function find<T>(
    collection: string,
    locale: Locale,
    qs: Record<string, string | number | boolean | undefined> = {},
): Promise<FindResponse<T>> {
    if (isStrapi) {
        return strapiFind<T>(collection, locale, qs) as Promise<FindResponse<T>>
    }
    return payloadFind<T>(collection, locale, qs)
}

/**
 * Get a full URL for a media object.
 */
export const getMediaURL = (media?: any): string | null => {
    if (isStrapi) {
        return strapiMediaURL(media)
    }
    return payloadMediaURL(media)
}
