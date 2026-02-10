"use client"

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'

const DEFAULT_SOCIAL_URLS = {
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  linkedin: 'https://www.linkedin.com/',
  youtube: 'https://www.youtube.com/',
  x: 'https://x.com/',
}

export type FooterSocialUrls = Partial<typeof DEFAULT_SOCIAL_URLS>

export function FooterSocial({ urls }: { urls?: FooterSocialUrls }) {
  const resolved = { ...DEFAULT_SOCIAL_URLS, ...(urls || {}) }
  const socials = [
    { name: 'Facebook', href: resolved.facebook, icon: faFacebook },
    { name: 'Instagram', href: resolved.instagram, icon: faInstagram },
    { name: 'LinkedIn', href: resolved.linkedin, icon: faLinkedin },
    { name: 'YouTube', href: resolved.youtube, icon: faYoutube },
    { name: 'X', href: resolved.x, icon: faXTwitter },
  ]

  return (
    <div className="flex items-center gap-4">
      {socials.map((s) => (
        <Link
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={s.name}
        >
          <FontAwesomeIcon icon={s.icon} className="h-4 w-4" />
        </Link>
      ))}
    </div>
  )
}
