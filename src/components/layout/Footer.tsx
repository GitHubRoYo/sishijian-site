import Link from "next/link"
import Image from "next/image"
import { Locale } from "@/lib/i18n"
import type { NavigationGlobal, SiteSettingsGlobal } from '@/lib/api'
import { getTranslations } from 'next-intl/server'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { FooterSocial } from '@/components/layout/FooterSocial'

interface FooterProps {
  locale: Locale
  navigation: NavigationGlobal
  siteSettings: SiteSettingsGlobal
}

const withLocale = (locale: Locale, url: string) => {
  if (!url) return `/${locale}`
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/admin') || url.startsWith('/graphql') || url.startsWith('/api') || url.startsWith('/media') || url.startsWith('/assets')) return url
  if (url === '/') return `/${locale}`
  return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`
}

export async function Footer({ locale, navigation, siteSettings }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'newsletter' })

  const footerColumns = navigation.footerNav || []
  const footerBottom = navigation.footerBottom
  const brand = siteSettings.companyNameShort || '四時鑑'
  const brandLong = siteSettings.companyName || ''
  const email = siteSettings.contact?.email || 'info@sishijian.com.hk'
  const address = (siteSettings.contact?.address && siteSettings.contact.address.length > 5) ? siteSettings.contact.address : '香港馬灣珀欣路33號馬灣1868'

  return (
    <footer className="border-t border-[hsl(var(--brand-gold)/0.2)] bg-[hsl(var(--brand-dark))] text-white selection:bg-[hsl(var(--brand-gold))] selection:text-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 selection:bg-[hsl(var(--brand-gold))] selection:text-black">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image src="/assets/logos/sishijian-logo.svg" alt="四時鑑" fill className="object-contain" />
              </div>
              <h3 className="text-lg font-bold text-[hsl(var(--brand-gold))]">{brand}</h3>
            </div>
            <p className="text-sm text-white/60">
              品牌與中國文化推廣的商業賦能平台
            </p>
            <p className="text-sm text-white/60">
              以「文化+商業」雙輪驅動，助力品牌實現可持續增長
            </p>
            {brandLong ? (
              <p className="text-xs text-white/40">{brandLong}</p>
            ) : null}
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[hsl(var(--brand-gold))]">聯絡</h4>
            <div className="space-y-2 text-sm text-white/60">
              <div>
                <span className="font-medium">地址：</span>
                <span>{address}</span>
              </div>
              <div>
                <span className="font-medium">電郵：</span>
                <a className="hover:text-[hsl(var(--brand-gold))] transition-colors" href={`mailto:${email}`}>{email}</a>
              </div>
            </div>
          </div>

          {footerColumns.slice(0, 2).map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold mb-4 text-[hsl(var(--brand-gold))]">{col.title}</h4>
              <ul className="space-y-2">
                {(col.links || []).map((link) => (
                  <li key={link.url}>
                    <Link
                      href={withLocale(locale, link.url)}
                      className="text-sm text-white/60 hover:text-[hsl(var(--brand-gold))] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-semibold mb-4 text-[hsl(var(--brand-gold))]">{t('title')}</h4>
            <p className="text-sm text-white/60 mb-4">{t('subtitle')}</p>
            <NewsletterForm locale={locale} />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">
            {footerBottom?.copyright || '© 2026 四時鑑天下環球媒體娛樂文化股份有限公司 版權所有'}
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <FooterSocial
              urls={{
                facebook: siteSettings.social?.facebook || undefined,
                instagram: siteSettings.social?.instagram || undefined,
                linkedin: siteSettings.social?.linkedin || undefined,
                x: undefined,
                youtube: undefined,
              }}
            />
            <div className="flex space-x-6">
              {(footerBottom?.legalLinks || []).filter((l) => l.label && l.url).map((l) => (
                <Link
                  key={l.url}
                  href={withLocale(locale, l.url!)}
                  className="text-sm text-white/40 hover:text-[hsl(var(--brand-gold))] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
