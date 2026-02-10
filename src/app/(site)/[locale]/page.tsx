import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Briefcase, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConsultButton } from '@/components/leads/ConsultButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BrandWall } from '@/components/brand-wall/BrandWall'
import { CTASection } from '@/components/layout/CTASection'
import type { Metadata } from 'next'
import { Locale } from '@/lib/i18n'
import {
  getMediaURL,
  find,
  getGlobal,
  type CaseDoc,
  type HomepageGlobal,
  type SiteSettingsGlobal,
} from '@/lib/api'
import { defaultHero, defaultServiceItems, defaultFeaturedCases } from '@/lib/defaultContent'

export const dynamic = 'force-dynamic'

interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  const [siteSettings, homepage] = await Promise.all([
    getGlobal<SiteSettingsGlobal>('site-settings', locale, 2),
    getGlobal<HomepageGlobal>('homepage', locale, 3),
  ])

  const title = homepage.seo?.title || siteSettings.defaultSeo?.title || '四時鑑'
  const description = homepage.seo?.description || siteSettings.defaultSeo?.description
  const og = getMediaURL(siteSettings.defaultSeo?.ogImage || (homepage.hero?.backgroundImage as any))

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: og ? [{ url: og }] : [],
    },
  }
}

const serviceImages: Record<string, { src: string; alt: string }> = {
  '/services/brand-advertising': {
    src: '/assets/seed/digital-analytics.png',
    alt: '品牌廣告業務',
  },
  '/services/culture-art': {
    src: '/assets/seed/culture-fabric-art.png',
    alt: '文化藝術業務',
  },
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  const [homepage, featured] = await Promise.all([
    getGlobal<HomepageGlobal>('homepage', locale, 3),
    find<CaseDoc>('cases', locale, {
      'where[status][equals]': 'published',
      'where[featured][equals]': 'true',
      limit: 6,
      sort: '-updatedAt',
    }),
  ])

  const heroImage = getMediaURL(homepage.hero?.backgroundImage as any)

  // Use default content when CMS returns empty
  const hero = {
    ...defaultHero,
    ...homepage.hero,
    title: homepage.hero?.title || defaultHero.title,
    subtitle: homepage.hero?.subtitle || defaultHero.subtitle,
    description: homepage.hero?.description || defaultHero.description,
  }
  const serviceItems = (homepage.services?.items && homepage.services.items.length > 0)
    ? homepage.services.items
    : defaultServiceItems
  const featuredDocs = featured.docs.length > 0 ? featured.docs : defaultFeaturedCases

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden section-dark min-h-[90vh] flex items-center">
        {/* Ambient gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[hsl(40_42%_48%/0.06)] blur-[120px]" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[hsl(348_50%_30%/0.04)] blur-[100px]" />
        </div>
        {heroImage ? (
          <div className="absolute inset-0">
            <Image src={heroImage} alt="" fill priority className="object-cover opacity-12" />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(28_18%_6%/0.5)] via-[hsl(28_18%_6%/0.7)] to-[hsl(28_18%_6%)]" />
          </div>
        ) : null}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 relative z-10">
          <div className="max-w-3xl animate-slide-up">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(40_42%_48%/0.2)] bg-[hsl(40_42%_48%/0.06)] px-5 py-2 text-sm text-[hsl(40,48%,65%)]">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(40,48%,55%)]" />
              <span className="tracking-wide">品牌廣告與文化藝術雙輪驅動</span>
            </div>

            {/* Title */}
            <h1 className="mt-8 text-4xl md:text-6xl lg:text-[4rem] font-bold font-serif tracking-tight leading-[1.1] text-gradient-gold drop-shadow-sm">
              {hero.title}
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-[hsl(38,14%,72%)] font-light leading-relaxed">
              {hero.subtitle}
            </p>

            <p className="mt-5 text-base md:text-lg text-[hsl(38,10%,50%)] leading-relaxed max-w-2xl">
              {hero.description}
            </p>

            {/* CTA buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <ConsultButton
                locale={locale}
                size="lg"
                source={`/${locale}?source=hero`}
                className="bg-[hsl(40,42%,48%)] text-[hsl(28,18%,6%)] hover:bg-[hsl(40,42%,55%)] font-semibold shadow-lg shadow-[hsl(40_42%_48%/0.15)]"
              >
                <span className="inline-flex items-center">
                  {hero.ctaPrimary?.label || '立即諮詢'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </ConsultButton>
              <Button
                size="lg"
                variant="luxury"
                className="backdrop-blur-sm"
                asChild
              >
                <Link href={`/${locale}${hero.ctaSecondary?.url || '/services'}`}>
                  {hero.ctaSecondary?.label || '了解更多服務'}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-24 md:py-32 section-warm relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="max-w-3xl mb-16">
            <p className="text-sm font-medium tracking-widest uppercase text-[hsl(var(--brand-crimson))] mb-3">
              Our Services
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              {homepage.services?.title || '服務總覽'}
            </h2>
            {homepage.services?.description ? (
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {homepage.services.description}
              </p>
            ) : null}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {(serviceItems || []).slice(0, 2).map((item, idx) => {
              const imgData = serviceImages[item.url || '']
              const isFirst = idx === 0
              return (
                <Card
                  key={item.url || item.title}
                  className="group overflow-hidden border border-transparent hover:border-[hsl(var(--brand-gold)/0.3)] shadow-sm hover:shadow-2xl transition-all duration-500 bg-white/50 backdrop-blur-sm hover-lift"
                >
                  {imgData ? (
                    <div className="relative h-60 overflow-hidden">
                      <Image
                        src={imgData.src}
                        alt={imgData.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-5">
                        <Badge
                          className={`${isFirst
                            ? 'bg-[hsl(var(--brand-crimson))]'
                            : 'bg-[hsl(var(--brand-gold))]'
                            } text-white border-0 text-sm px-3.5 py-1`}
                        >
                          {isFirst ? '品牌廣告' : '文化藝術'}
                        </Badge>
                      </div>
                    </div>
                  ) : null}
                  <CardHeader className="pb-2 pt-6">
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    {item.description ? (
                      <CardDescription className="mt-2.5 text-base leading-relaxed">
                        {item.description}
                      </CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent className="pt-3 pb-6">
                    <Button
                      variant="outline"
                      className="w-full border-[hsl(var(--brand-crimson)/0.15)] text-[hsl(var(--brand-crimson))] hover:bg-[hsl(var(--brand-crimson)/0.04)] hover:border-[hsl(var(--brand-crimson)/0.3)]"
                      asChild
                    >
                      <Link href={`/${locale}${item.url || '/services'}`}>
                        了解更多
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

      {/* ===== FEATURED CASES ===== */}
      <section className="py-24 md:py-32 relative">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-widest uppercase text-[hsl(var(--brand-gold))] mb-3">
                Case Studies
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">
                {homepage.featuredCases?.title || '案例精選'}
              </h2>
              {homepage.featuredCases?.description ? (
                <p className="mt-4 text-lg text-muted-foreground">
                  {homepage.featuredCases.description}
                </p>
              ) : null}
            </div>
            <Button
              variant="outline"
              className="hidden md:inline-flex border-[hsl(var(--brand-crimson)/0.15)] text-[hsl(var(--brand-crimson))] hover:bg-[hsl(var(--brand-crimson)/0.04)]"
              asChild
            >
              <Link href={`/${locale}/cases`}>
                查看全部案例
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {featuredDocs.slice(0, 6).map((c) => {
              const cover = getMediaURL(c.cover as any)
              const industryName =
                typeof c.industry === 'object' ? c.industry?.name : undefined
              return (
                <Link key={c.id} href={`/${locale}/cases/${c.slug}`} className="group">
                  <Card className="overflow-hidden h-full border border-transparent group-hover:border-[hsl(var(--brand-gold)/0.3)] shadow-sm hover:shadow-lg transition-all duration-500 bg-card hover-lift">
                    <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={
                            typeof (c.cover as any)?.alt === 'string'
                              ? (c.cover as any).alt
                              : ''
                          }
                          fill
                          className="object-cover transition-transform duration-600 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <Briefcase className="h-10 w-10 opacity-20" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="pt-5">
                      {industryName ? (
                        <Badge className="w-fit mb-2 bg-[hsl(var(--brand-crimson)/0.08)] text-[hsl(var(--brand-crimson))] border-[hsl(var(--brand-crimson)/0.15)] text-xs">
                          {industryName}
                        </Badge>
                      ) : null}
                      <CardTitle className="text-base leading-snug group-hover:text-[hsl(var(--brand-crimson))] transition-colors">
                        {c.title}
                      </CardTitle>
                      {c.summary ? (
                        <CardDescription className="line-clamp-2 mt-1.5">
                          {c.summary}
                        </CardDescription>
                      ) : null}
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>

          <div className="mt-10 md:hidden">
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/${locale}/cases`}>
                查看全部案例
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== BRAND WALL ===== */}
      <section className="relative py-24 md:py-32 section-dark overflow-hidden">
        {/* Ambient light */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-[hsl(40_42%_48%/0.04)] blur-[100px]" />
          <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[35%] rounded-full bg-[hsl(348_50%_30%/0.03)] blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-14">
            <p className="text-sm font-medium tracking-widest uppercase text-[hsl(40,48%,55%)] mb-3">
              Partners
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              {homepage.partners?.title || '合作媒體與平台'}
            </h2>
            {homepage.partners?.description ? (
              <p className="mt-4 text-lg text-[hsl(38,10%,48%)]">
                {homepage.partners.description}
              </p>
            ) : null}
          </div>

          <BrandWall />

          <div className="mt-14">
            <ConsultButton
              locale={locale}
              variant="outline"
              className="border-[hsl(40_42%_48%/0.25)] text-[hsl(40,48%,65%)] hover:bg-[hsl(40_42%_48%/0.08)] hover:text-[hsl(40,48%,75%)] hover:border-[hsl(40_42%_48%/0.4)] w-full md:w-auto"
              source={`/${locale}?source=partners`}
              preset={{ partnershipType: 'media' }}
            >
              <span className="inline-flex items-center">
                了解合作渠道建議
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </ConsultButton>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <CTASection
        locale={locale}
        title={homepage.cta?.title || '準備好開啟您的\n品牌增長之旅了嗎？'}
        description={homepage.cta?.description}
        buttonText={homepage.cta?.buttonText || '立即諮詢'}
        source="home-cta"
      />
    </>
  )
}
