"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { LeadCaptureDialog } from './LeadCaptureDialog'

type OpenOptions = {
  locale: Locale
  source?: string
  preset?: {
    businessInterest?: string[]
    partnershipType?: string
  }
}

type LeadCaptureContextValue = {
  openLeadCapture: (options: OpenOptions) => void
}

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null)

export function useLeadCapture() {
  const ctx = useContext(LeadCaptureContext)
  if (!ctx) throw new Error('useLeadCapture must be used within LeadCaptureProvider')
  return ctx
}

export function LeadCaptureProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [locale, setLocale] = useState<Locale>('zh-HK')
  const [source, setSource] = useState<string>('')
  const [preset, setPreset] = useState<OpenOptions['preset']>({})

  const openLeadCapture = useCallback(
    (options: OpenOptions) => {
      setLocale(options.locale)
      setSource(options.source || pathname || '')
      setPreset(options.preset || {})
      setOpen(true)
    },
    [pathname],
  )

  const value = useMemo(() => ({ openLeadCapture }), [openLeadCapture])

  return (
    <LeadCaptureContext.Provider value={value}>
      {children}
      <LeadCaptureDialog
        open={open}
        onOpenChange={setOpen}
        locale={locale}
        source={source}
        preset={preset}
      />
    </LeadCaptureContext.Provider>
  )
}

