import { notFound } from 'next/navigation'
import { locales, Locale } from '@/lib/i18n'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { getGlobal, type NavigationGlobal, type SiteSettingsGlobal } from '@/lib/api'
import { LeadCaptureProvider } from '@/components/leads/LeadCaptureProvider'

export const dynamic = 'force-dynamic'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!locales.includes(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  const [navigation, siteSettings] = await Promise.all([
    getGlobal<NavigationGlobal>('navigation', locale, 3),
    getGlobal<SiteSettingsGlobal>('site-settings', locale, 3),
  ])

  return (
    <NextIntlClientProvider messages={messages}>
      <LeadCaptureProvider>
        <div className="flex min-h-screen flex-col">
          <Header locale={locale} navigation={navigation} siteSettings={siteSettings} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} navigation={navigation} siteSettings={siteSettings} />
        </div>
      </LeadCaptureProvider>
    </NextIntlClientProvider>
  )
}

