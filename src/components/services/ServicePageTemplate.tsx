import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  GraduationCap,
  Heart,
  LineChart,
  MapPin,
  Newspaper,
  Palette,
  Radio,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConsultButton } from '@/components/leads/ConsultButton'
import { CTASection } from '@/components/layout/CTASection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Locale } from '@/lib/i18n'
import { lexicalToPlainText } from '@/lib/lexicalPlainText'
import { getMediaURL, find, type ServicePage } from '@/lib/api'
import { defaultServicePages } from '@/lib/defaultContent'

const iconMap: Record<string, any> = {
  Radio,
  MapPin,
  Newspaper,
  LineChart,
  GraduationCap,
  Compass,
  Palette,
  Heart,
}

const pickIcon = (name?: string) => {
  if (!name) return ArrowRight
  return iconMap[name] || ArrowRight
}

const faqJsonLd = (url: string, items: Array<{ question?: string; answer?: any }>) => {
  const mainEntity = items
    .filter((i) => i.question)
    .map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: lexicalToPlainText(i.answer),
      },
    }))

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
    url,
  }
}

const fallbackBullets: Record<string, Record<string, string[]>> = {
  'brand-advertising': {
    'Radio': [
      '全渠道媒體策劃與投放：覆蓋本地報刊、電視、電台、戶外及數位媒體',
      '社交媒體內容策略：Facebook、Instagram、小紅書、抖音等多平台運營',
      'KOL / KOC 合作管理：精準匹配意見領袖，放大品牌聲量',
      '媒體公關與新聞稿撰寫：權威媒體曝光，建立品牌公信力',
      '效果追蹤與優化報告：數據驅動決策，持續提升 ROI',
    ],
    'MapPin': [
      '本地生活平台運營：OpenRice、Google Maps、大眾點評等評價管理',
      '門店數位化升級：線上預訂、會員系統、智能排隊等方案',
      '本地社群活動策劃：快閃店、品鑒會、社區互動等落地活動',
      'O2O 流量轉化：線上曝光導流至線下門店的完整閉環',
      '本地化內容創作：契合香港及大灣區消費者的語言與文化語境',
    ],
    'Newspaper': [
      '品牌故事策劃與撰寫：深度挖掘品牌核心，打造有溫度的敘事',
      '權威媒體發稿：南華早報、明報、經濟日報等主流媒體合作',
      '危機公關應對方案：快速響應，維護品牌聲譽',
      '行業論壇與獎項申報：提升品牌在行業中的專業形象',
      '企業社會責任傳播：公益活動策劃與媒體宣傳',
    ],
    'LineChart': [
      '品牌官網 / 小程序開發：響應式設計，支持多語言（繁/簡/英）',
      'SEO 搜索引擎優化：關鍵詞策略、內容優化、技術 SEO',
      'SEM 付費搜索廣告：Google Ads、百度推廣等精準投放',
      '數據分析儀表板：實時監控品牌曝光、流量與轉化數據',
      'CRM 客戶關係管理：從觸達到留存的全鏈路用戶運營',
    ],
  },
  'culture-art': {
    'GraduationCap': [
      '非遺工藝體驗課程：書法、茶道、紮染、剪紙等沉浸式學習',
      '企業團建文化活動：為品牌定制獨特的文化體驗與團建方案',
      '學校與社區教育項目：面向青少年的中國文化入門與深度體驗',
      '線上文化課堂：跨地域的非遺知識傳播與互動教學',
      '文化導師資源庫：連接非遺傳承人、藝術家與教育專家',
    ],
    'Compass': [
      '香港文化主題路線：廟宇、老街、手藝工坊等深度文化行程',
      '大灣區非遺探訪：走訪粵繡、陶瓷、中醫藥等非遺基地',
      '品牌定制遊學團：結合企業品牌理念的文化探索旅程',
      '親子文化體驗營：寓教於樂的家庭式文化傳承活動',
      '國際交流項目：海外品牌的中國文化深度理解之旅',
    ],
    'Palette': [
      '非遺 IP 品牌聯名：將傳統紋樣、工藝元素融入產品設計',
      '文創產品開發：從概念到量產的完整產品化鏈路',
      '品牌文化空間設計：將非遺元素融入門店、展廳、辦公空間',
      '限定系列策劃：節慶主題、文化紀念等限時聯創項目',
      '知識產權保護：協助非遺傳承人進行 IP 註冊與授權管理',
    ],
    'Heart': [
      '公益展覽策劃：非遺藝術展、文化攝影展等公共展示活動',
      '寄售平台運營：為非遺手藝人提供線上線下銷售渠道',
      '社會企業合作：連接公益基金會與非遺保護項目',
      '文化紀錄片製作：用影像記錄與傳播非遺故事',
      '志工項目組織：招募文化志工參與非遺保護行動',
    ],
  },
}

export async function ServicePageTemplate({ locale, slug }: { locale: Locale; slug: ServicePage['slug'] }) {
  const res = await find<ServicePage>('service-pages', locale, {
    'where[slug][equals]': slug,
    limit: 1,
  })

  const doc = res.docs[0] || defaultServicePages[slug]
  const hero = getMediaURL(doc?.heroImage as any)

  if (!doc) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-semibold">服務頁面未找到</h1>
        <p className="mt-2 text-muted-foreground">請稍後再試，或從服務總覽進入。</p>
        <div className="mt-6">
          <Button asChild>
            <Link href={`/${locale}/services`}>返回服務總覽</Link>
          </Button>
        </div>
      </div>
    )
  }

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const pageUrl = `${siteUrl}/${locale}/services/${slug}`
  const faq = Array.isArray(doc.faq) ? doc.faq : []
  const slugBullets = fallbackBullets[slug] || {}

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden section-dark">
        {hero ? (
          <div className="absolute inset-0">
            <Image src={hero} alt={doc.heroTitle || doc.title || '服務主視覺'} fill priority className="object-cover opacity-12" />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(28_18%_6%/0.5)] via-[hsl(28_18%_6%/0.7)] to-[hsl(28_18%_6%)]" />
          </div>
        ) : null}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] left-[20%] w-[40%] h-[50%] rounded-full bg-[hsl(348_50%_30%/0.04)] blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">{doc.heroTitle || doc.title}</h1>
            {doc.heroDescription ? (
              <p className="mt-5 text-lg md:text-xl text-[hsl(38,14%,68%)] leading-relaxed">{doc.heroDescription}</p>
            ) : null}
            <div className="mt-10">
              <ConsultButton
                locale={locale}
                size="lg"
                className="bg-[hsl(40,42%,48%)] text-[hsl(28,18%,6%)] hover:bg-[hsl(40,42%,55%)] font-semibold shadow-lg shadow-[hsl(40_42%_48%/0.15)]"
                source={`/${locale}/services/${slug}?source=service-hero`}
                preset={{ businessInterest: [slug] }}
              >
                <span className="inline-flex items-center">
                  {doc.ctaButtonText || '立即諮詢'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </ConsultButton>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services - Alternating Layout (Extended) */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
           <Image 
             src="/assets/seed/misc-web-asset-03.jpg"
             alt=""
             fill
             className="object-cover opacity-[0.03]"
           />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">核心服務模組</h2>
            <p className="mt-4 text-lg text-muted-foreground">可按需要從單點支援到全案整合，並保留後續擴展空間。</p>
          </div>

          <div className="space-y-20">
            {(doc.services || []).map((s, idx) => {
              const Icon = pickIcon(s.icon)
              const img = getMediaURL(s.image as any)
              const isReversed = idx % 2 === 1
              const bullets = slugBullets[s.icon || ''] || []
              const contentText = s.content ? lexicalToPlainText(s.content) : ''

              return (
                <div
                  key={s.anchorId}
                  id={s.anchorId}
                  className="scroll-mt-24"
                >
                  <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
                    {/* Image Side */}
                    <div className={`relative ${isReversed ? 'lg:col-start-2' : ''}`}>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-lg">
                        {img ? (
                          <Image src={img} alt={s.title || '服務圖片'} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                            <Icon className="h-16 w-16 text-zinc-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Text Side */}
                    <div className={isReversed ? 'lg:col-start-1' : ''}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">{s.title}</h3>
                      </div>

                      {s.description ? (
                        <p className="text-muted-foreground leading-relaxed text-base mb-6">{s.description}</p>
                      ) : null}

                      {contentText ? (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{contentText}</p>
                      ) : null}

                      {bullets.length > 0 ? (
                        <ul className="space-y-3">
                          {bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                              <span className="text-sm text-muted-foreground leading-relaxed">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Suited For + Quick Check */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">適用對象</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(doc.ideallySuitedFor || []).map((i, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-muted-foreground leading-relaxed">{i.item}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">快速對照</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(doc.quickCheck || []).map((q, idx) => (
                  <div key={idx} className="rounded-lg border bg-background p-4">
                    <div className="text-sm">
                      <span className="font-medium">如果：</span>
                      <span>{q.condition}</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">那麼：</span>
                      <span>{q.result}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold">常見問題</h2>
            <p className="mt-4 text-lg text-muted-foreground">如需更精準的方案建議，請直接聯絡我們。</p>
          </div>
          <div className="mt-10 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faq.map((f, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {lexicalToPlainText(f.answer)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(pageUrl, faq)) }}
          />
        </div>
      </section>

      {/* Bottom CTA */}
      <CTASection
        locale={locale}
        title={doc.ctaTitle || '想了解最適合您的方案？'}
        description={doc.ctaDescription || '留下需求，我們會根據您的目標與資源提出建議。'}
        buttonText={doc.ctaButtonText || '立即諮詢'}
        source={`/${locale}/services/${slug}?source=service-cta`}
      />
    </>
  )
}
