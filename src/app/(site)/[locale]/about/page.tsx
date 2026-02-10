import Image from 'next/image'
import { Locale } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, BarChart3, Flag, Globe, Handshake, Lightbulb, Share2, Telescope } from 'lucide-react'

interface AboutPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: AboutPageProps) {
  await params
  return {
    title: '關於我們 - 四時鑑',
    description: '了解四時鑑的使命、願景與雙輪驅動模型。我們致力於將文化權力轉化為可持續的商業價值與社會影響力。',
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  await params
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden section-dark">
        <div className="absolute inset-0">
          <Image
            src="/assets/seed/hong-kong-scenery.png"
            alt="香港城市景觀背景"
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(28_18%_6%/0.3)] via-[hsl(28_18%_6%/0.5)] to-[hsl(28_18%_6%)]" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] right-[10%] w-[40%] h-[50%] rounded-full bg-[hsl(40_42%_48%/0.05)] blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl animate-slide-up">
            <p className="text-sm font-medium tracking-widest uppercase text-[hsl(40,48%,55%)] mb-4">
              About Us
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">關於我們</h1>
            <p className="text-xl md:text-2xl text-[hsl(38,14%,68%)] font-light leading-relaxed">
              四時鑑天下環球媒體娛樂文化股份有限公司，是一家植根於香港的「品牌與中國文化推廣商業賦能平台」。
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 section-warm relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none">
           <Image
             src="/assets/seed/misc-web-asset-01.jpg"
             alt=""
             fill
             className="object-cover opacity-5"
           />
         </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-md bg-white gold-border-top">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-[hsl(var(--brand-crimson)/0.08)] flex items-center justify-center mb-4">
                  <Flag className="h-7 w-7 text-[hsl(var(--brand-crimson))]" />
                </div>
                <CardTitle className="text-2xl">我們的使命</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">
                  將文化「權力」轉化為可持續的商業價值與社會影響力，構建一個品牌與中國文化推廣的商業賦能平台。我們不僅是品牌服務商，更是梳理中國文化的創新者與商業轉化夥伴。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white gold-border-top">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-[hsl(var(--brand-gold)/0.1)] flex items-center justify-center mb-4">
                  <Telescope className="h-7 w-7 text-[hsl(var(--brand-gold))]" />
                </div>
                <CardTitle className="text-2xl">我們的願景</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">
                  致力成為香港及周邊市場值得信賴的文化營銷夥伴，推動更多品牌透過「文化 + 商業」雙引擎實現長效增長。我們相信，深厚的文化是品牌最獨特的力量源泉。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dual Drive Model */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium tracking-widest uppercase text-[hsl(var(--brand-gold))] mb-3">
              Dual-Engine Model
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">雙輪驅動模型</h2>
            <p className="text-lg text-muted-foreground">品牌廣告與文化藝術雙輪協同，互相賦能，共同構建商業與文化良性生態</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Brand Advertising Card */}
            <Card className="overflow-hidden border-0 shadow-md bg-white">
              <div className="relative h-52 bg-muted overflow-hidden">
                <Image
                  src="/assets/seed/digital-analytics.png"
                  alt="品牌廣告業務 - 數位營銷策略分析"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-[hsl(var(--brand-crimson))] text-white hover:bg-[hsl(var(--brand-crimson))] border-0">品牌廣告</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">品牌廣告業務</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  成為香港甲方品牌的優質傳媒供應商，提供一站式、高轉化的整合營銷解決方案。
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">全媒體整合營銷</Badge>
                  <Badge variant="secondary">本地生活運營</Badge>
                  <Badge variant="secondary">權威媒體公關</Badge>
                  <Badge variant="secondary">數位化升級</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Culture Art Card */}
            <Card className="overflow-hidden border-0 shadow-md bg-white">
              <div className="relative h-52 bg-muted overflow-hidden">
                <Image
                  src="/assets/seed/culture-fabric-art.png"
                  alt="文化藝術業務 - 傳統織物與非遺藝術"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-[hsl(var(--brand-gold))] text-white hover:bg-[hsl(var(--brand-gold))] border-0">文化藝術</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">文化藝術業務</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  打造沉浸式中國文化當代化展示與教育平台，將非遺轉化為可體驗、可定制、可聯名的商業與文化價值。
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">非遺教育體驗</Badge>
                  <Badge variant="secondary">文化遊學</Badge>
                  <Badge variant="secondary">IP商業聯創</Badge>
                  <Badge variant="secondary">公益寄售</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-[hsl(var(--brand-crimson)/0.04)] to-[hsl(var(--brand-gold)/0.06)] border-[hsl(var(--brand-gold)/0.15)] shadow-sm">
              <CardContent className="py-8 px-8">
                <h3 className="text-xl font-semibold mb-3">協同效應</h3>
                <p className="text-muted-foreground leading-relaxed">
                  雙輪協同，互相賦能，共同構建商業與文化良性生態。品牌廣告為文化藝術提供市場化路徑，文化藝術為品牌廣告注入獨特的文化內涵。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Advantages */}
      <section className="py-20 md:py-28 section-warm relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none">
           <Image
             src="/assets/seed/misc-web-asset-04.jpg"
             alt=""
             fill
             className="object-cover opacity-5"
           />
         </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium tracking-widest uppercase text-[hsl(var(--brand-crimson))] mb-3">
              Advantages
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">核心優勢</h2>
            <p className="text-lg text-muted-foreground">我們的獨特價值主張</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: '雙市場基因', desc: '深諳香港與內地市場文化語境，實現「本地化溝通，全球化視野」。' },
              { icon: Lightbulb, title: '模組化解決方案', desc: '可根據客戶需求靈活組合服務模組，提供輕量級優化包或全案整合營銷。' },
              { icon: Award, title: '文化與商業融合', desc: '將非遺、藝術等文化元素融入品牌敘事，提升品牌內涵與辨識度。' },
              { icon: BarChart3, title: '數據驅動決策', desc: '依託數據分析工具，實現策略動態調整與效果持續優化。' },
              { icon: Handshake, title: '長期夥伴關係', desc: '我們不僅是服務商，更是品牌增長的共建者與戰略合夥人。' },
              { icon: Share2, title: '深厚資源網絡', desc: '連結非遺項目、媒體平台與內容創作者等合作資源，按專案需求靈活調配。' },
            ].map((item) => (
              <Card key={item.title} className="group hover:shadow-md transition-all duration-300 border-0 shadow-sm bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--brand-crimson)/0.06)] flex items-center justify-center mb-3">
                    <item.icon className="h-6 w-6 text-[hsl(var(--brand-crimson))]" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="relative py-20 md:py-28 section-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/seed/team-meeting.png"
            alt="團隊合作場景"
            fill
            className="object-cover opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(28_18%_6%/0.6)] via-[hsl(28_18%_6%/0.8)] to-[hsl(28_18%_6%)]" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] right-[5%] w-[30%] h-[40%] rounded-full bg-[hsl(40_42%_48%/0.04)] blur-[80px]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-medium tracking-widest uppercase text-[hsl(40,48%,55%)] mb-3 text-center">
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">我們的故事</h2>
            <p className="text-center text-[hsl(38,10%,45%)] text-lg mb-14">從文化深處出發，為品牌注入持久的生命力</p>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <p className="text-[hsl(38,14%,72%)] leading-relaxed text-base">
                  四時鑑植根香港，深耕大灣區，連接內地市場。我們深信文化塑造規則，定義生活。在這個快速變化的時代，我們致力於成為品牌與中國文化之間的橋樑，將千年文化智慧轉化為當代商業靈感。
                </p>
                <p className="text-[hsl(38,14%,72%)] leading-relaxed text-base">
                  無論您是想深耕本地市場，還是佈局跨境發展，四時鑑都願與您攜手，共鑑品牌未來。我們會持續精進服務與方法，與夥伴共建長期合作。
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[hsl(38,14%,85%)]">我們的理念</h3>
                <ul className="space-y-4">
                  {[
                    { title: '文化即力量', desc: '深厚的文化底蘊是品牌最獨特的差異化優勢' },
                    { title: '雙輪驅動', desc: '品牌廣告與文化藝術互相賦能，構建良性生態' },
                    { title: '長期主義', desc: '不追求短期流量，而是為品牌建立可持續的文化資產' },
                    { title: '本地洞察', desc: '深諳香港與大灣區市場，精準連接文化語境與商業機遇' },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-[hsl(var(--brand-gold))] shrink-0" />
                      <div>
                        <div className="font-medium text-[hsl(38,14%,85%)]">{item.title}</div>
                        <div className="text-sm text-[hsl(38,10%,45%)] mt-0.5">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
