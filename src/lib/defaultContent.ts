/**
 * Default / fallback content for when CMS returns empty data.
 * This ensures the site looks complete even without Strapi content.
 */

import type { NavigationGlobal, HomepageGlobal, SiteSettingsGlobal, CaseDoc } from './api'

// ---------- Navigation ----------

export const defaultHeaderNav: NonNullable<NavigationGlobal['headerNav']> = [
  {
    label: '服務',
    url: '/services',
    order: 1,
    children: [
      { label: '品牌廣告', url: '/services/brand-advertising', description: '全方位品牌推廣方案' },
      { label: '文化藝術', url: '/services/culture-art', description: '非遺與文化項目策劃' },
    ],
  },
  { label: '案例', url: '/cases', order: 2 },
  { label: '關於', url: '/about', order: 3 },
  { label: '聯絡', url: '/contact', order: 4 },
]

export const defaultFooterNav: NonNullable<NavigationGlobal['footerNav']> = [
  {
    title: '服務',
    links: [
      { label: '品牌廣告', url: '/services/brand-advertising' },
      { label: '文化藝術', url: '/services/culture-art' },
      { label: '所有服務', url: '/services' },
    ],
  },
  {
    title: '公司',
    links: [
      { label: '關於我們', url: '/about' },
      { label: '案例', url: '/cases' },
      { label: '聯絡我們', url: '/contact' },
    ],
  },
]

// ---------- Homepage ----------

export const defaultHero: NonNullable<HomepageGlobal['hero']> = {
  title: '四時更迭，鑑往知來',
  subtitle: '品牌與中國文化推廣的商業賦能平台',
  description: '以「品牌廣告」與「文化藝術」雙輪驅動，為品牌量身打造全方位的推廣策略，助力品牌實現可持續增長。',
  ctaPrimary: { label: '立即諮詢', url: '/contact' },
  ctaSecondary: { label: '了解更多服務', url: '/services' },
}

export const defaultServiceItems: NonNullable<HomepageGlobal['services']>['items'] = [
  {
    title: '品牌廣告',
    description: '涵蓋品牌策略、社交媒體運營、KOL 合作、數碼廣告投放及線下活動策劃，打造跨媒體整合營銷方案。',
    icon: 'briefcase',
    url: '/services/brand-advertising',
  },
  {
    title: '文化藝術',
    description: '專注非物質文化遺產活化、文創產品開發、文化展覽策劃及藝術社區營造，推動文化商業化與可持續發展。',
    icon: 'sparkles',
    url: '/services/culture-art',
  },
]

export const defaultFeaturedCases: CaseDoc[] = [
  {
    id: 'demo-1',
    slug: 'heritage-brand-revival',
    title: '傳統老字號品牌活化',
    summary: '為一家百年老字號品牌打造全新的品牌形象與數碼營銷策略，成功提升品牌知名度並吸引年輕消費群體。',
    businessType: 'brand-advertising',
    status: 'published',
    featured: true,
  },
  {
    id: 'demo-2',
    slug: 'intangible-heritage-exhibition',
    title: '非遺文化藝術展覽策劃',
    summary: '策劃並執行大型非物質文化遺產展覽，吸引超過10萬人次參觀，成功推動文化傳承與公眾教育。',
    businessType: 'culture-art',
    status: 'published',
    featured: true,
  },
  {
    id: 'demo-3',
    slug: 'cross-border-campaign',
    title: '跨境品牌推廣方案',
    summary: '為國際品牌進入大灣區市場制定本地化策略，整合線上線下渠道實現品牌落地與市場拓展。',
    businessType: 'brand-advertising',
    status: 'published',
    featured: true,
  },
]

// ---------- Site Settings ----------

export const defaultSiteSettings: SiteSettingsGlobal = {
  companyNameShort: '四時鑑',
  companyName: '四時鑑天下環球媒體娛樂文化股份有限公司',
  domain: 'sishijian.com.hk',
  contact: {
    address: '香港馬灣珀欣路33號馬灣1868',
    email: 'info@sishijian.com.hk',
    businessHours: '星期一至五 09:00 - 18:00',
  },
}
