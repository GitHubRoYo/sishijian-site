"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Briefcase, Filter, Palette } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ConsultButton } from '@/components/leads/ConsultButton'
import type { CaseDoc, Taxonomy } from '@/lib/api'
import { getMediaURL } from '@/lib/api'
import type { Locale } from '@/lib/i18n'

type BusinessFilter = 'all' | 'brand-advertising' | 'culture-art'

const businessLabel: Record<BusinessFilter, string> = {
  all: '全部',
  'brand-advertising': '品牌廣告',
  'culture-art': '文化藝術',
}

const businessIcon: Record<BusinessFilter, any> = {
  all: Filter,
  'brand-advertising': Briefcase,
  'culture-art': Palette,
}

export function CasesExplorer({
  locale,
  cases,
  industries,
}: {
  locale: Locale
  cases: CaseDoc[]
  industries: Taxonomy[]
}) {
  const [business, setBusiness] = useState<BusinessFilter>('all')
  const [industrySlug, setIndustrySlug] = useState<string>('all')

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (business !== 'all' && c.businessType !== business) return false
      if (industrySlug !== 'all') {
        const industry = typeof c.industry === 'object' ? c.industry?.slug : null
        if (industry !== industrySlug) return false
      }
      return true
    })
  }, [business, cases, industrySlug])

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">按業務類型</div>
              <div className="mt-2">
                <Tabs value={business} onValueChange={(v) => setBusiness(v as BusinessFilter)}>
                  <TabsList className="flex-wrap h-auto">
                    {(Object.keys(businessLabel) as BusinessFilter[]).map((key) => {
                      const Icon = businessIcon[key]
                      return (
                        <TabsTrigger key={key} value={key} className="text-sm gap-2">
                          <Icon className="h-4 w-4" />
                          {businessLabel[key]}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="md:text-right">
              <div className="text-sm text-muted-foreground">結果</div>
              <div className="mt-2 text-sm">
                <span className="font-medium">{filtered.length}</span>
                <span className="text-muted-foreground"> / {cases.length}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 border-t pt-6">
            <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">按行業篩選</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={industrySlug === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIndustrySlug('all')}
              >
                全部行業
              </Button>
              {industries.map((i) => (
                <Button
                  key={i.slug}
                  variant={industrySlug === i.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIndustrySlug(i.slug)}
                >
                  {i.name || i.slug}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 p-8 text-center">
          <div className="text-base font-medium">暫無符合條件的案例</div>
          <div className="mt-2 text-sm text-muted-foreground">你可以清除篩選，或留下需求讓我們按方向提供建議。</div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => (setBusiness('all'), setIndustrySlug('all'))}>清除篩選</Button>
            <ConsultButton locale={locale} label="立即諮詢" source={`/${locale}/cases?source=cases-empty`} />
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => {
            const cover = getMediaURL(c.cover as any)
            const industryName = typeof c.industry === 'object' ? c.industry?.name : undefined
            const bt = c.businessType || 'brand-advertising'
            return (
              <Link key={c.id} href={`/${locale}/cases/${c.slug}`} className="group">
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-500 border border-transparent hover:border-[hsl(var(--brand-gold)/0.3)] bg-white hover-lift">
                  <div className="aspect-[16/9] bg-muted relative">
                    {cover ? (
                      <Image src={cover} alt={typeof (c.cover as any)?.alt === 'string' ? (c.cover as any).alt : '案例封面'} fill className="object-cover" />
                    ) : null}
                    <div className="absolute left-4 top-4 flex gap-2">
                      <Badge variant={bt === 'brand-advertising' ? 'default' : 'secondary'}>
                        {bt === 'brand-advertising' ? '品牌廣告' : '文化藝術'}
                      </Badge>
                      {industryName ? <Badge variant="outline" className="bg-background/70">{industryName}</Badge> : null}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">{c.title}</CardTitle>
                    {c.summary ? <CardDescription>{c.summary}</CardDescription> : null}
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
