import type { Metadata } from 'next'
import { ServicePageTemplate } from '@/components/services/ServicePageTemplate'
import { Locale } from '@/lib/i18n'
import { find, type ServicePage } from '@/lib/api'
import { defaultServicePages } from '@/lib/defaultContent'

export const dynamic = 'force-dynamic'

interface ServicePageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale } = await params
  const res = await find<ServicePage>('service-pages', locale, {
    'where[slug][equals]': 'culture-art',
    limit: 1,
  })
  const doc = res.docs[0] || defaultServicePages['culture-art']

  return {
    title: doc?.seo?.title || '文化藝術業務 - 四時鑑',
    description: doc?.seo?.description,
  }
}

export default async function CultureArtPage({ params }: ServicePageProps) {
  const { locale } = await params
  return (
    <>
      <h1 className="sr-only">文化藝術業務</h1>
      <h2 className="sr-only">服務詳情</h2>
      <ServicePageTemplate locale={locale} slug="culture-art" />
    </>
  )
}

