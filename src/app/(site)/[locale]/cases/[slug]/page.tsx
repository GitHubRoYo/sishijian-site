import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, Award, Building2, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConsultButton } from '@/components/leads/ConsultButton'
import { Locale } from '@/lib/i18n'
import { lexicalToPlainText } from '@/lib/lexicalPlainText'
import { getMediaURL, find, type CaseDoc } from '@/lib/api'
import { defaultCaseDetails, defaultFeaturedCases } from '@/lib/defaultContent'

export const dynamic = 'force-dynamic'

interface CaseDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateMetadata({ params }: CaseDetailPageProps) {
  const { locale, slug } = await params
  const res = await find<CaseDoc>('cases', locale, {
    'where[slug][equals]': slug,
    limit: 1,
  })
  const doc = res.docs[0]

  if (!doc) return { title: '案例未找到 - 四時鑑' } satisfies Metadata

  return {
    title: doc.seo?.title || `${doc.title} - 成功案例 - 四時鑑`,
    description: doc.seo?.description || doc.summary,
  } satisfies Metadata
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { locale, slug } = await params
  const res = await find<CaseDoc>('cases', locale, {
    'where[slug][equals]': slug,
    limit: 1,
  })
  const doc = res.docs[0] || defaultCaseDetails[slug]
  console.log(`[CaseDetailPage] Found doc: ${doc ? 'yes' : 'no'}, title: ${doc?.title}`)

  if (!doc) notFound()

  const cover = getMediaURL(doc.cover as any)
  const industryName = typeof doc.industry === 'object' ? doc.industry?.name : undefined
  const bt = doc.businessType

  const relatedRes = await find<CaseDoc>('cases', locale, {
    'where[status][equals]': 'published',
    'where[slug][not_equals]': slug,
    ...(bt ? { 'where[businessType][equals]': bt } : {}),
    limit: 2,
    sort: '-updatedAt',
  })

  // Fallback for related cases if CMS returns few/none
  let relatedDocs = relatedRes.docs
  if (relatedDocs.length < 2) {
    const fallbackRelated = defaultFeaturedCases
      .filter((c) => c.slug !== slug && (bt ? c.businessType === bt : true))
      .slice(0, 2 - relatedDocs.length)
    relatedDocs = [...relatedDocs, ...fallbackRelated]
  }

  return (
    <>
      <h2 className="sr-only">案例詳情</h2>
      <section className="relative overflow-hidden section-dark py-20 md:py-28">
        {cover ? (
          <div className="absolute inset-0">
            <Image
              src={cover}
              alt={typeof (doc.cover as any)?.alt === 'string' ? (doc.cover as any).alt : '案例背景'}
              fill
              priority
              className="object-cover opacity-12"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(28_18%_6%/0.5)] via-[hsl(28_18%_6%/0.7)] to-[hsl(28_18%_6%)]" />
          </div>
        ) : null}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] right-[10%] w-[40%] h-[50%] rounded-full bg-[hsl(40_42%_48%/0.05)] blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href={`/${locale}/cases`}
            className="inline-flex items-center text-[hsl(38,14%,60%)] hover:text-[hsl(38,14%,80%)] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回案例列表
          </Link>
          <div className="animate-slide-up">
            <div className="flex flex-wrap gap-2 mb-4">
              {industryName ? <Badge variant="secondary">{industryName}</Badge> : null}
              {bt ? (
                <Badge variant="outline" className="text-[hsl(38,14%,85%)] border-[hsl(38_14%_35%/0.3)]">
                  {bt === 'brand-advertising' ? '品牌廣告' : '文化藝術'}
                </Badge>
              ) : null}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{doc.title}</h1>
            {doc.summary ? <p className="text-lg md:text-xl text-[hsl(38,14%,60%)] max-w-2xl">{doc.summary}</p> : null}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {cover ? (
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-muted">
                  <Image
                    src={cover}
                    alt={typeof (doc.cover as any)?.alt === 'string' ? (doc.cover as any).alt : '案例封面'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    背景與挑戰
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{lexicalToPlainText(doc.background)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                    </div>
                    策略與執行
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{lexicalToPlainText(doc.strategy)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    成果與影響
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{lexicalToPlainText(doc.results)}</div>
                </CardContent>
              </Card>

              {doc.gallery?.length ? (
                <div>
                  <h3 className="text-xl font-semibold mb-4">項目圖集</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {doc.gallery.map((g, idx) => {
                      const img = getMediaURL(g.image as any)
                      return (
                        <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                          {img ? <Image src={img} alt={g.caption || '案例圖片'} fill className="object-cover" /> : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">使用的服務</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(doc.servicesUsed || []).map((s: any, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {typeof s === 'object' ? s.title : '服務'}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">對類似服務感興趣？</h4>
                  <p className="text-sm text-slate-300 mb-4">聯繫我們，獲取專屬的品牌解決方案</p>
                  <ConsultButton
                    locale={locale}
                    className="w-full bg-white text-slate-900 hover:bg-white/90"
                    source={`/${locale}/cases/${slug}?source=case-sidebar`}
                    preset={bt ? { businessInterest: [bt] } : undefined}
                  >
                    <span className="inline-flex items-center">
                      立即諮詢
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </ConsultButton>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">相關案例</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedDocs.map((r) => (
                      <Link
                        key={r.id}
                        href={`/${locale}/cases/${r.slug}`}
                        className="block p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="font-medium text-sm">{r.title}</div>
                        <div className="text-xs text-muted-foreground">{typeof r.industry === 'object' ? r.industry?.name : ''}</div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

