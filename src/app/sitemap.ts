import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://sishijian.com.hk'
  
  // Define all routes
  const routes = [
    '',
    '/about',
    '/services/brand-advertising',
    '/services/culture-art',
    '/cases',
    '/contact',
  ]
  
  // Generate sitemap entries for all locale combinations
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  for (const route of routes) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      })
    }
  }
  
  return sitemapEntries
}
