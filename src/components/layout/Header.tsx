"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Globe, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConsultButton } from '@/components/leads/ConsultButton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { localeLabels, locales, Locale } from "@/lib/i18n"
import type { NavigationGlobal, SiteSettingsGlobal } from '@/lib/api'
import { defaultHeaderNav } from '@/lib/defaultContent'

interface HeaderProps {
  locale: Locale
  navigation: NavigationGlobal
  siteSettings: SiteSettingsGlobal
}

const withLocale = (locale: Locale, url: string) => {
  if (!url) return `/${locale}`
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/admin') || url.startsWith('/graphql') || url.startsWith('/api') || url.startsWith('/media') || url.startsWith('/assets')) return url
  if (url === '/') return `/${locale}`
  return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`
}

export function Header({ locale, navigation, siteSettings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const headerNav = useMemo(() => {
    const items = (navigation.headerNav && navigation.headerNav.length > 0)
      ? navigation.headerNav
      : defaultHeaderNav
    return [...items].sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [navigation.headerNav])

  const ctaLabel = navigation.ctaButton?.label || '立即諮詢'
  const ctaUrl = navigation.ctaButton?.url || '/contact'

  const localeOptions = useMemo(() => locales.map((l) => ({ code: l, label: localeLabels[l] })), [])

  const switchLocale = (nextLocale: Locale) => {
    const parts = (pathname || '/').split('/').filter(Boolean)
    const current = parts[0]
    const rest = locales.includes(current as Locale) ? parts.slice(1) : parts
    const nextPath = `/${nextLocale}/${rest.join('/')}`.replace(/\/$/, '')
    const qs = searchParams?.toString()
    router.push(qs ? `${nextPath}?${qs}` : nextPath)
  }

  const brand = siteSettings.companyNameShort || '四時鑑'

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300",
      scrolled
        ? "border-b border-[rgba(255,255,255,0.08)] bg-background/60 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-background/40"
        : "border-transparent bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/assets/logos/sishijian-logo.svg"
                alt="四時鑑"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-base font-semibold tracking-tight md:text-lg text-[hsl(var(--brand-crimson))]">{brand}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {headerNav.map((item) =>
              item.children?.length ? (
                <DropdownMenu key={item.url}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                      <span>{item.label}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.url} asChild>
                        <Link href={withLocale(locale, child.url)} className="cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-medium">{child.label}</div>
                            {child.description ? (
                              <div className="text-xs text-muted-foreground">{child.description}</div>
                            ) : null}
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.url}
                  href={withLocale(locale, item.url)}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{localeLabels[locale]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {localeOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.code}
                    onClick={() => switchLocale(opt.code)}
                    className={cn(opt.code === locale && 'font-semibold')}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ConsultButton locale={locale} label={ctaLabel} />
          </div>

          {/* Mobile Menu Button - Client Only to avoid hydration mismatch */}
          <div className="md:hidden">
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "關閉選單" : "開啟選單"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="flex flex-col space-y-4 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{localeLabels[locale]}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span>語言</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {localeOptions.map((opt) => (
                    <DropdownMenuItem
                      key={opt.code}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        switchLocale(opt.code)
                      }}
                      className={cn(opt.code === locale && 'font-semibold')}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {headerNav.map((item) => (
              <div key={item.url}>
                {item.children?.length ? (
                  <>
                    <span className="text-sm font-medium text-foreground/80">{item.label}</span>
                    <div className="ml-4 mt-2 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.url}
                          href={withLocale(locale, child.url)}
                          className="block text-sm text-foreground/70 hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={withLocale(locale, item.url)}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <ConsultButton
              locale={locale}
              label={ctaLabel}
              className="w-full"
              onClick={() => setMobileMenuOpen(false)}
            />
          </nav>
        </div>
      </div>
    </header>
  )
}
