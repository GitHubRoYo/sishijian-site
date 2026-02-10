import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Locale } from '@/lib/i18n'
import { find, getGlobal, type SiteSettingsGlobal, type Taxonomy } from '@/lib/api'
import { ContactForm } from '@/components/contact/ContactForm'

export const dynamic = 'force-dynamic'

interface ContactPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: ContactPageProps) {
  await params
  return {
    title: '聯絡我們 - 四時鑑',
    description: '聯絡四時鑑，提交合作或服務諮詢。我們會根據你的需求盡快跟進。',
  } satisfies Metadata
}
export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  const [site, industries] = await Promise.all([
    getGlobal<SiteSettingsGlobal>('site-settings', locale, 2),
    find<Taxonomy>('taxonomies', locale, {
      'where[type][equals]': 'industry',
      limit: 100,
      sort: 'order',
    }),
  ])

  return (
    <>
      <h2 className="sr-only">聯絡表單</h2>
      <section className="relative overflow-hidden section-dark py-20 md:py-28">
        <div className="absolute inset-0">
          <Image
            src="/assets/seed/presentation-cover.png"
            alt="品牌與文化合作背景"
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
              Contact Us
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">聯絡我們</h1>
            <p className="text-xl md:text-2xl text-[hsl(38,14%,68%)] font-light leading-relaxed">留下需求，我們會以合適的方式與您跟進。</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>服務諮詢表單</CardTitle>
                  <CardDescription>填寫表單後，我們會在工作時間內與您聯絡並了解需求細節。</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm locale={locale} industries={industries.docs} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>聯絡資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">地址</div>
                      <div className="text-sm text-muted-foreground">{site.contact?.address && site.contact.address.length > 5 ? site.contact.address : '香港馬灣珀欣路33號馬灣1868'}</div>
                    </div>
                  </div>
                  {site.contact?.phone ? (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">電話</div>
                        <div className="text-sm text-muted-foreground">{site.contact.phone}</div>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">電郵</div>
                      <div className="text-sm text-muted-foreground">{site.contact?.email || 'info@sishijian.com.hk'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">辦公時間</div>
                      <div className="text-sm text-muted-foreground">
                        {site.contact?.businessHours || '星期一至五 09:00 - 18:00'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg overflow-hidden border bg-muted aspect-video">
                <iframe
                  title="四時鑑辦公位置（香港）"
                  src="https://www.google.com/maps?q=Ma+Wan+1868,+33+Pak+Yan+Rd,+Ma+Wan,+Hong+Kong&output=embed"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

