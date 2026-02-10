export const locales = ['zh-HK', 'en', 'zh-Hans'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'zh-HK'

export const localeLabels: Record<Locale, string> = {
  'zh-HK': '繁體中文',
  'en': 'English',
  'zh-Hans': '简体中文',
}

export const localePrefix = 'always'
