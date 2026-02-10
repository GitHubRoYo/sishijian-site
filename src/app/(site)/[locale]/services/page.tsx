import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Locale } from '@/lib/i18n'
import { find, type ServicePage } from '@/lib/api'
import { CTASection } from '@/components/layout/CTASection'

export const dynamic = 'force-dynamic'

interface ServicesPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: ServicesPageProps) {
  await params
  return {
    title: '服務 - 四時鑑',
    description: '四時鑑提供品牌廣告與文化藝術兩大業務，協助品牌建立聲量並深化文化價值。',
  } satisfies Metadata
}

const serviceCards: Record<string, { image: string; alt: string; badge: string; badgeColor: string }> = {
  'brand-advertising': {
    image: '/assets/seed/digital-analytics.png',
    alt: '品牌廣告業務 - 數位營銷策略',
    badge: '品牌廣告',
    badgeColor: 'bg-[hsl(var(--brand-crimson))]',
  },
  'culture-art': {
    image: '/assets/seed/culture-fabric-art.png',
    alt: '文化藝術業務 - 傳統工藝',
    badge: '文化藝術',
    badgeColor: 'bg-[hsl(var(--brand-gold))]',
  },
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params

  const pages = await find<ServicePage>('service-pages', locale, { limit: 10 })
  const brand = pages.docs.find((d) => d.slug === 'brand-advertising')
  const culture = pages.docs.find((d) => d.slug === 'culture-art')

  const services = [
    { doc: brand, slug: 'brand-advertising' as const },
    { doc: culture, slug: 'culture-art' as const },
  ]

  return (
    <>
      <h2 className="sr-only">服務總覽</h2>

      {/* Hero */}
      <section className="relative overflow-hidden section-dark py-20 md:py-28">
        <div className="absolute inset-0">
          <Image
            src="/assets/seed/misc-web-asset-02.jpg"
            alt="服務總覽背景"
            fill
            priority
            className="object-cover opacity-12"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(28_18%_6%/0.5)] via-[hsl(28_18%_6%/0.7)] to-[hsl(28_18%_6%)]" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] left-[20%] w-[40%] h-[50%] rounded-full bg-[hsl(348_50%_30%/0.04)] blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl animate-slide-up">
            <p className="text-sm font-medium tracking-widest uppercase text-[hsl(40,48%,55%)] mb-4">
              Our Services
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif tracking-tight drop-shadow-sm">我們的服務</h1>
            <p className="text-xl md:text-2xl text-[hsl(38,14%,68%)] font-light leading-relaxed">
              以「品牌廣告」與「文化藝術」雙輪驅動，為您提供全方位的品牌增長解決方案
            </p>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-20 md:py-28 section-warm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map(({ doc, slug }) => {
              const card = serviceCards[slug]
              return (
                <Card key={slug} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-[hsl(var(--brand-gold)/0.3)] shadow-md bg-white hover-lift">
                  <div className="relative h-60 bg-muted overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-5">
                      <Badge className={`${card.badgeColor} text-white border-0 text-sm px-3.5 py-1`}>
                        {card.badge}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pt-6">
                    <CardTitle className="text-2xl">{doc?.title || (slug === 'brand-advertising' ? '品牌廣告業務' : '文化藝術業務')}</CardTitle>
                    {doc?.heroDescription ? <CardDescription className="text-base mt-2 leading-relaxed">{doc.heroDescription}</CardDescription> : null}
                  </CardHeader>
                  <CardContent className="space-y-4 pb-6">
                    <Button
                      className="w-full bg-[hsl(var(--brand-crimson))] hover:bg-[hsl(var(--brand-crimson)/0.9)] text-white"
                      asChild
                    >
                      <Link href={`/${locale}/services/${slug}`}>
                        了解詳情
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        locale={locale}
        title="需要量身定制的方案？"
        description="無論是精準的數字營銷，還是深度的文化跨界，我們都能為您提供專業的建議與執行方案。"
        buttonText="預約免費諮詢"
        source="services-cta"
      />
    </>
  )
}
