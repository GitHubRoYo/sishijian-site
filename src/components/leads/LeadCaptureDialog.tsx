"use client"

import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/lib/i18n'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: Locale
  source: string
  preset?: {
    businessInterest?: string[]
    partnershipType?: string
  }
}

const schema = z
  .object({
    name: z.string().min(1),
    company: z.string().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    message: z.string().optional().or(z.literal('')),
    businessInterest: z.array(z.string()).min(1),
  })
  .refine((v) => Boolean(v.phone?.trim() || v.email?.trim()), {
    message: 'NEED_CONTACT',
    path: ['phone'],
  })

const interestOptions = [
  { id: 'brand-advertising', labelKey: 'brandAdvertising' },
  { id: 'culture-art', labelKey: 'cultureArt' },
  { id: 'intangible-heritage', labelKey: 'intangibleHeritage' },
  { id: 'cultural-experience', labelKey: 'culturalExperience' },
  { id: 'other', labelKey: 'other' },
]

export function LeadCaptureDialog({ open, onOpenChange, locale, source, preset }: Props) {
  const t = useTranslations('leadModal')
  const tCommon = useTranslations('common')
  const tContact = useTranslations('contact')

  const initial = useMemo(() => {
    const presetInterests = preset?.businessInterest || []
    const businessInterest: Record<string, boolean> = {}
    for (const opt of interestOptions) {
      businessInterest[opt.id] = presetInterests.length ? presetInterests.includes(opt.id) : opt.id === 'brand-advertising'
    }

    return {
      name: '',
      company: '',
      phone: '',
      email: '',
      message: '',
      businessInterest,
    }
  }, [preset?.businessInterest])

  const [form, setForm] = useState(initial)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')

  const selectedInterests = Object.entries(form.businessInterest)
    .filter(([, v]) => v)
    .map(([k]) => k)

  const reset = () => {
    setForm(initial)
    setSubmitting(false)
    setStatus('idle')
    setErrorText('')
  }

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) reset()
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus('idle')
    setErrorText('')

    const parsed = schema.safeParse({
      name: form.name.trim(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      businessInterest: selectedInterests,
    })

    if (!parsed.success) {
      setSubmitting(false)
      setStatus('error')
      const needContact = parsed.error.issues.some((i) => i.message === 'NEED_CONTACT')
      setErrorText(needContact ? t('validationNeedContact') : t('validationError'))
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
          message: parsed.data.message || undefined,
          businessInterest: parsed.data.businessInterest,
          partnershipType: preset?.partnershipType || undefined,
          source: source || `/${locale}`,
        }),
      })

      if (!res.ok) throw new Error('Request failed')

      setStatus('success')
    } catch {
      setStatus('error')
      setErrorText(t('submitError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('subtitle')}</DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-emerald-50 px-4 py-3">
              <div className="font-medium text-emerald-900">{t('successTitle')}</div>
              <div className="text-sm text-emerald-800">{t('successDesc')}</div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => handleOpenChange(false)}>{t('close')}</Button>
            </div>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={onSubmit}>
            {status === 'error' ? (
              <div className="rounded-lg border bg-rose-50 px-4 py-3">
                <div className="font-medium text-rose-900">{t('errorTitle')}</div>
                <div className="text-sm text-rose-800">{errorText || t('submitError')}</div>
              </div>
            ) : null}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-name">{tContact('fields.name')} *</Label>
                <Input
                  id="lead-name"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder={t('placeholders.name')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-company">{tContact('fields.company')}</Label>
                <Input
                  id="lead-company"
                  value={form.company}
                  onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
                  placeholder={t('placeholders.company')}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-phone">{tContact('fields.phone')}</Label>
                <Input
                  id="lead-phone"
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  placeholder={t('placeholders.phone')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-email">{tContact('fields.email')}</Label>
                <Input
                  id="lead-email"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  type="email"
                  placeholder={t('placeholders.email')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{tContact('fields.interests')} *</Label>
              <div className="grid sm:grid-cols-2 gap-3">
                {interestOptions.map((opt) => (
                  <div key={opt.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lead-interest-${opt.id}`}
                      checked={!!form.businessInterest[opt.id]}
                      onCheckedChange={(checked) =>
                        setForm((s) => ({
                          ...s,
                          businessInterest: { ...s.businessInterest, [opt.id]: Boolean(checked) },
                        }))
                      }
                    />
                    <Label htmlFor={`lead-interest-${opt.id}`} className="font-normal cursor-pointer">
                      {tContact(`interests.${opt.labelKey}`)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-message">{tContact('fields.message')}</Label>
              <Textarea
                id="lead-message"
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                placeholder={t('placeholders.message')}
                rows={4}
              />
            </div>

            <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">{t('whatYouGetTitle')}</div>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>{t('whatYouGet1')}</li>
                <li>{t('whatYouGet2')}</li>
                <li>{t('whatYouGet3')}</li>
              </ul>
              <div className="mt-3 text-xs">{t('privacyNote')}</div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? tCommon('submitting') : t('submit')}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

