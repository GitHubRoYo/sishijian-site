/**
 * CMS API entry point — Strapi 5
 *
 * All pages should import from this file for data fetching and types.
 */

import type { Locale } from './i18n'

// Re-export all shared types so pages only need one import
export type {
  Media,
  NavigationGlobal,
  SiteSettingsGlobal,
  HomepageGlobal,
  ServicePage,
  Taxonomy,
  CaseDoc,
  FindResponse,
} from './types'

// Backwards-compatible alias
export type { Media as PayloadMedia } from './types'

import {
  strapiGetGlobal,
  strapiFind,
  strapiMediaURL,
} from './strapiApi'

import type { FindResponse } from './types'

/**
 * Fetch a CMS global / single-type.
 * Slug should match the Strapi single-type API ID (e.g. 'site-settings', 'navigation', 'homepage').
 */
export async function getGlobal<T>(slug: string, locale: Locale, depth: number = 2): Promise<T> {
  return strapiGetGlobal<T>(slug, locale, depth)
}

/**
 * Fetch a CMS collection.
 */
export async function find<T>(
  collection: string,
  locale: Locale,
  qs: Record<string, string | number | boolean | undefined> = {},
): Promise<FindResponse<T>> {
  return strapiFind<T>(collection, locale, qs)
}

/**
 * Get a full URL for a media object.
 */
export const getMediaURL = (media?: any): string | null => {
  return strapiMediaURL(media)
}
