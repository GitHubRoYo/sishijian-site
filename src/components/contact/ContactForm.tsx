"use client"

import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Locale } from '@/lib/i18n'
import type { Taxonomy } from '@/lib/api'

type FormState = {
  name: string
  company: string
  phone: string
  email: string
  industryId: string
  message: string
  partnershipType: string
  businessInterest: Record<string, boolean>
}

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  industryId: z.string().optional().or(z.literal('')),
  message: z.string().min(1),
  partnershipType: z.string().optional().or(z.literal('')),
  businessInterest: z.array(z.string()).min(1),
})

const interests = [
  { id: 'brand-advertising', labelKey: 'brandAdvertising' },
  { id: 'culture-art', labelKey: 'cultureArt' },
  { id: 'intangible-heritage', labelKey: 'intangibleHeritage' },
  { id: 'cultural-experience', labelKey: 'culturalExperience' },
  { id: 'other', labelKey: 'other' },
]

const partnershipTypes = [
  { value: 'brand-client', labelKey: 'brandClient' },
  { value: 'artist', labelKey: 'artist' },
  { value: 'charity', labelKey: 'charity' },
  { value: 'media', labelKey: 'media' },
  { value: 'other', labelKey: 'other' },
]

export function ContactForm({ locale, industries }: { locale: Locale; industries: Taxonomy[] }) {
  const t = useTranslations('contact')
  const tCommon = useTranslations('common')

  const initialState: FormState = useMemo(
    () => ({
      name: '',
      company: '',
      phone: '',
      email: '',
      industryId: '',
      message: '',
      partnershipType: '',
      businessInterest: {
        'brand-advertising': true,
        'culture-art': false,
        'intangible-heritage': false,
        'cultural-experience': false,
        other: false,
      },
    }),
    [],
  )

  const [form, setForm] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorText, setErrorText] = useState<string>('')

  const selectedInterests = Object.entries(form.businessInterest)
    .filter(([, v]) => v)
    .map(([k]) => k)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus('idle')
    setErrorText('')

    const parsed = schema.safeParse({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      industryId: form.industryId,
      message: form.message.trim(),
      partnershipType: form.partnershipType,
      businessInterest: selectedInterests,
    })

    if (!parsed.success) {
      setSubmitting(false)
      setStatus('error')
      setErrorText(t('validationError'))
      return
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: parsed.data.name,
          company: parsed.data.company || undefined,
          phone: parsed.data.phone || undefined,
          email: parsed.data.email || undefined,
          businessInterest: parsed.data.businessInterest,
          industry: parsed.data.industryId || undefined,
          message: parsed.data.message,
          partnershipType: parsed.data.partnershipType || undefined,
          source: `/${locale}/contact`,
        }),
      })

      if (!res.ok) {
        throw new Error('Request failed')
      }

      setStatus('success')
      setForm(initialState)
    } catch {
      setStatus('error')
      setErrorText(t('errorDesc'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {status === 'success' ? (
        <div className="rounded-lg border bg-emerald-50 px-4 py-3">
          <div className="font-medium text-emerald-900">{t('successTitle')}</div>
          <div className="text-sm text-emerald-800">{t('successDesc')}</div>
        </div>
      ) : null}
      {status === 'error' ? (
        <div className="rounded-lg border bg-rose-50 px-4 py-3">
          <div className="font-medium text-rose-900">{t('errorTitle')}</div>
          <div className="text-sm text-rose-800">{errorText || t('errorDesc')}</div>
        </div>
      ) : null}

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('fields.name')} *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder={t('placeholders.name')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">{t('fields.company')}</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
              placeholder={t('placeholders.company')}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">{t('fields.phone')}</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              type="tel"
              placeholder={t('placeholders.phone')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('fields.email')}</Label>
            <Input
              id="email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              type="email"
              placeholder={t('placeholders.email')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('fields.interests')} *</Label>
          <div className="grid sm:grid-cols-2 gap-3">
            {interests.map((interest) => (
              <div key={interest.id} className="flex items-center space-x-2">
                <Checkbox
                  id={interest.id}
                  checked={!!form.businessInterest[interest.id]}
                  onCheckedChange={(checked) =>
                    setForm((s) => ({
                      ...s,
                      businessInterest: { ...s.businessInterest, [interest.id]: Boolean(checked) },
                    }))
                  }
                />
                <Label htmlFor={interest.id} className="font-normal cursor-pointer">
                  {t(`interests.${interest.labelKey}`)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('fields.partnershipType')}</Label>
            <Select value={form.partnershipType} onValueChange={(v) => setForm((s) => ({ ...s, partnershipType: v }))}>
              <SelectTrigger>
                <SelectValue placeholder={t('placeholders.partnershipType')} />
              </SelectTrigger>
              <SelectContent>
                {partnershipTypes.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {t(`partnershipTypes.${p.labelKey}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('fields.industry')}</Label>
            <Select value={form.industryId} onValueChange={(v) => setForm((s) => ({ ...s, industryId: v }))}>
              <SelectTrigger>
                <SelectValue placeholder={t('placeholders.industry')} />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id}>
                    {industry.name || industry.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{t('fields.message')} *</Label>
          <Textarea
            id="message"
            value={form.message}
            onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
            placeholder={t('placeholders.message')}
            rows={5}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? tCommon('submitting') : tCommon('submit')}
        </Button>
      </form>
    </div>
  )
}
