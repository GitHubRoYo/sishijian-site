import type { Metadata } from 'next'
import { Inter, Noto_Serif_SC } from 'next/font/google'
import '../globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const notoserif = Noto_Serif_SC({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '四時鑑 - 品牌與中國文化推廣的商業賦能平台',
  description:
    '四時鑑是一家植根香港的品牌與中國文化推廣商業賦能平台，以文化+商業雙輪驅動，為企業提供一站式整合營銷解決方案。',
  keywords: '品牌廣告,文化藝術,非遺,整合營銷,香港,大灣區',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK" className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        notoserif.variable
      )}>
        {children}
      </body>
    </html>
  )
}

