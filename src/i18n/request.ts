import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, locales } from '@/lib/i18n'

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locales.includes(locale as any) ? (locale as any) : defaultLocale

  const messages = (await import(`../messages/${resolvedLocale}.json`)).default

  return {
    locale: resolvedLocale,
    messages,
  }
})

