"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/lib/i18n'
import { useLeadCapture } from './LeadCaptureProvider'

type Props = {
  locale: Locale
  label?: string
  source?: string
  preset?: {
    businessInterest?: string[]
    partnershipType?: string
  }
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}

export function ConsultButton({ locale, label, source, preset, variant, size, className, onClick, children }: Props) {
  const { openLeadCapture } = useLeadCapture()

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        onClick?.()
        openLeadCapture({ locale, source, preset })
      }}
    >
      {children || label}
    </Button>
  )
}
