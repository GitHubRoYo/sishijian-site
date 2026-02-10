import type { Metadata } from 'next'
import Image from 'next/image'
import { Locale } from '@/lib/i18n'
import { find, type CaseDoc, type Taxonomy } from '@/lib/api'
import { defaultFeaturedCases, defaultIndustries } from '@/lib/defaultContent'
import { CasesExplorer } from '@/components/cases/CasesExplorer'

export const dynamic = 'force-dynamic'

interface CasesPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: CasesPageProps) {
  await params
  return {
    title: '成功案例 - 四時鑑',
    description: '探索四時鑑在品牌廣告與文化藝術領域的案例，並以行業與業務類型快速篩選。',
  } satisfies Metadata
}
export default async function CasesPage({ params }: CasesPageProps) {
  const { locale } = await params
  const [casesRes, industriesRes] = await Promise.all([
    find<CaseDoc>('cases', locale, {
      'where[status][equals]': 'published',
      limit: 100,
      sort: '-updatedAt',
    }),
    find<Taxonomy>('taxonomies', locale, {
      'where[type][equals]': 'industry',
      limit: 100,
      sort: 'order',
    }),
  ])

  return (
    <>
      <h2 className="sr-only">案例篩選</h2>
      <section className="relative overflow-hidden section-dark py-20 md:py-28">
        <div className="absolute inset-0">
          <Image
            src="/assets/seed/presentation-cover-alt.png"
            alt="成功案例背景"
            fill
            priority
            className="object-cover opacity-12"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(28_18%_6%/0.5)] via-[hsl(28_18%_6%/0.7)] to-[hsl(28_18%_6%)]" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] right-[10%] w-[40%] h-[50%] rounded-full bg-[hsl(40_42%_48%/0.05)] blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl animate-slide-up">
            <p className="text-sm font-medium tracking-widest uppercase text-[hsl(40,48%,55%)] mb-4">
              Case Studies
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif tracking-tight drop-shadow-sm">成功案例</h1>
            <p className="text-xl md:text-2xl text-[hsl(38,14%,68%)] font-light leading-relaxed">以業務類型與行業篩選，快速找到相近的案例結構與呈現方式。</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CasesExplorer
            locale={locale}
            cases={casesRes.docs.length > 0 ? casesRes.docs : defaultFeaturedCases}
            industries={industriesRes.docs.length > 0 ? industriesRes.docs : defaultIndustries}
          />
        </div>
      </section>
    </>
  )
}

