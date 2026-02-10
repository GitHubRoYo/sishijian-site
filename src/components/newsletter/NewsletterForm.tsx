"use client"

import { useState } from 'react'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/lib/i18n'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.string().email()

export function NewsletterForm({ locale }: { locale: Locale }) {
  const t = useTranslations('newsletter')

  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('idle')
    setMessage('')

    const parsed = schema.safeParse(email.trim())
    if (!parsed.success) {
      setStatus('error')
      setMessage(t('invalidEmail'))
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: parsed.data,
          locale,
          source: `/${locale}#footer-edm`,
        }),
      })

      if (res.ok) {
        setStatus('success')
        setMessage(t('success'))
        setEmail('')
        return
      }

      const text = await res.text()
      const isDuplicate = res.status === 409 || /duplicate|unique/i.test(text)
      setStatus(isDuplicate ? 'success' : 'error')
      setMessage(isDuplicate ? t('alreadySubscribed') : t('error'))
    } catch {
      setStatus('error')
      setMessage(t('error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          type="email"
          aria-label={t('placeholder')}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? t('submitting') : t('submit')}
        </Button>
      </div>
      {status !== 'idle' ? (
        <div className={status === 'success' ? 'text-xs text-emerald-700' : 'text-xs text-rose-700'}>{message}</div>
      ) : (
        <div className="text-xs text-muted-foreground">{t('note')}</div>
      )}
    </form>
  )
}

