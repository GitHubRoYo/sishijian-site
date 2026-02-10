import createMiddleware from 'next-intl/middleware'
import { defaultLocale, locales } from './lib/i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export const config = {
  matcher: ['/((?!api|_next|admin|media|assets|favicon.ico|health|seed).*)'],
}
