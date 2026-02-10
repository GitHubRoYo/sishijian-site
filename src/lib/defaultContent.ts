/**
 * Default / fallback content for when CMS returns empty data.
 * This ensures the site looks complete even without Strapi content.
 */

import type { NavigationGlobal, HomepageGlobal, SiteSettingsGlobal, CaseDoc, ServicePage, Taxonomy } from './api'

// Helper to generate simple Lexical rich text structure
const simpleLexical = (text: string) => ({
  root: {
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text }],
      },
    ],
  },
})

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
  backgroundImage: '/assets/seed/hong-kong-scenery.png',
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

export const defaultCaseDetails: Record<string, CaseDoc> = {
  'heritage-brand-revival': {
    id: 'demo-1',
    slug: 'heritage-brand-revival',
    title: '傳統老字號品牌活化',
    summary: '為一家百年老字號品牌打造全新的品牌形象與數碼營銷策略，成功提升品牌知名度並吸引年輕消費群體。',
    businessType: 'brand-advertising',
    status: 'published',
    featured: true,
    cover: '/assets/seed/hong-kong-scenery.png',
    background: simpleLexical('該品牌擁有超過百年歷史，但隨著市場年輕化，其品牌形象逐漸老化，難以吸引新一代消費者。面臨的主要挑戰包括：品牌知名度在年輕群體中較低、產品包裝缺乏吸引力、線上銷售渠道薄弱。'),
    strategy: simpleLexical('1. 品牌重塑：保留傳統元素的同時，融入現代簡約設計風格，更新品牌 Logo 與包裝。\n2. 跨界合作：與本地插畫師聯名推出限定禮盒，製造話題。\n3. 社交媒體運營：開設 Instagram 與小紅書賬號，通過短視頻講述品牌歷史故事。'),
    results: simpleLexical('• 品牌年輕化指數提升 40%\n• 線上銷售額同比增長 150%\n• 社交媒體粉絲增長至 50,000+'),
    gallery: [
      { image: '/assets/seed/presentation-slide-01.png', caption: '新包裝設計' },
      { image: '/assets/seed/presentation-slide-02.png', caption: '線下快閃店' },
    ],
    servicesUsed: [{ title: '品牌策略' } as any, { title: '包裝設計' } as any, { title: '數碼營銷' } as any],
  },
  'intangible-heritage-exhibition': {
    id: 'demo-2',
    slug: 'intangible-heritage-exhibition',
    title: '非遺文化藝術展覽策劃',
    summary: '策劃並執行大型非物質文化遺產展覽，吸引超過10萬人次參觀，成功推動文化傳承與公眾教育。',
    businessType: 'culture-art',
    status: 'published',
    featured: true,
    cover: '/assets/seed/culture-fabric-art.png',
    background: simpleLexical('旨在通過現代展覽形式，讓更多公眾了解並喜愛傳統非遺文化。挑戰在於如何將靜態的展品轉化為互動性強、傳播力廣的現代藝術體驗。'),
    strategy: simpleLexical('1. 沉浸式策展：利用光影科技與裝置藝術，還原非遺製作場景。\n2. 互動體驗區：設置手作工作坊，讓觀眾親手體驗非遺工藝。\n3. 數字化導覽：開發 AR 小程序，實現展品背後故事的數字化解讀。'),
    results: simpleLexical('• 展覽參觀人次突破 10 萬\n• 媒體曝光量超過 500 萬\n• 觀眾滿意度高達 98%'),
    gallery: [
      { image: '/assets/seed/hk-street-art.png', caption: '展覽入口' },
      { image: '/assets/seed/charity-foundation.jpg', caption: '互動體驗區' },
    ],
    servicesUsed: [{ title: '展覽策劃' } as any, { title: '空間設計' } as any, { title: '公關傳播' } as any],
  },
  'cross-border-campaign': {
    id: 'demo-3',
    slug: 'cross-border-campaign',
    title: '跨境品牌推廣方案',
    summary: '為國際品牌進入大灣區市場制定本地化策略，整合線上線下渠道實現品牌落地與市場拓展。',
    businessType: 'brand-advertising',
    status: 'published',
    featured: true,
    cover: '/assets/seed/presentation-cover.png',
    background: simpleLexical('某國際知名護膚品牌計劃進入大灣區市場，但面臨文化差異與激烈的本土競爭。需要一套既符合品牌國際調性，又能打動本地消費者的市場進入策略。'),
    strategy: simpleLexical('1. 本地化內容矩陣：針對大灣區用戶習慣，定製粵語與普通話雙語內容。\n2. 雙微一抖一紅：全佈局微信、微博、抖音、小紅書，精準種草。\n3. KOC 試用計劃：招募千名素人體驗官，建立口碑護城河。'),
    results: simpleLexical('• 首發活動觸達用戶 200 萬+\n• 轉化率高於行業平均水平 30%\n• 成功建立大灣區核心社群'),
    gallery: [
      { image: '/assets/seed/analytics-dashboard.png', caption: '數據分析報告' },
      { image: '/assets/seed/social-media.png', caption: '社交媒體矩陣' },
    ],
    servicesUsed: [{ title: '市場進入策略' } as any, { title: '社交電商' } as any, { title: 'KOL 管理' } as any],
  },
}

// ---------- Service Pages ----------

export const defaultServicePages: Record<string, ServicePage> = {
  'brand-advertising': {
    id: 'default-brand-advertising',
    slug: 'brand-advertising',
    title: '品牌廣告業務',
    heroTitle: '品牌廣告業務',
    heroDescription: '以數據驅動的精準營銷，結合具備文化深度的品牌敘事，為您在競爭激烈的市場中建立獨特的品牌聲量。',
    heroImage: '/assets/seed/digital-analytics.png',
    ctaTitle: '準備好提升您的品牌影響力了嗎？',
    ctaDescription: '立即預約免費品牌診斷，讓我們為您量身定制增長方案。',
    ctaButtonText: '預約諮詢',
    services: [
      {
        anchorId: 'strategy',
        title: '品牌策略與定位',
        description: '從市場調研到品牌核心價值提煉，重塑品牌競爭力。',
        content: simpleLexical('我們通過深度的市場洞察，協助企業釐清品牌定位，建立差異化的品牌形象。服務包括：競爭環境分析、目標客群畫像、品牌故事梳理及視覺識別系統（VI）優化。'),
        icon: 'Compass',
        image: '/assets/seed/presentation-slide-04.png',
      },
      {
        anchorId: 'digital-marketing',
        title: '整合數碼營銷',
        description: '跨平台媒體投放與內容運營，實現全域流量增長。',
        content: simpleLexical('涵蓋 Google Ads、Meta (FB/IG)、小紅書及抖音等多平台投放策略。我們不僅關注曝光量，更看重轉化率與 ROI，通過精細化運營實現品效合一。'),
        icon: 'LineChart',
        image: '/assets/seed/analytics-dashboard.png',
      },
      {
        anchorId: 'social-content',
        title: '社交內容與 KOL 合作',
        description: '打造有共鳴的優質內容，鏈接品牌與消費者。',
        content: simpleLexical('提供從選題策劃、腳本撰寫到拍攝剪輯的一站式內容服務。同時擁有豐富的粵港澳大灣區 KOL/KOC 資源庫，精準匹配適合品牌的創作者進行推廣。'),
        icon: 'Heart',
        image: '/assets/seed/social-media.png',
      },
    ],
    ideallySuitedFor: [
      { item: '希望進入或拓展大灣區市場的國際品牌' },
      { item: '尋求品牌年輕化轉型的傳統企業' },
      { item: '需要精準流量與高轉化率的電商/零售品牌' },
    ],
    quickCheck: [
      { condition: '品牌知名度不足，難以觸達精準客群', result: '需要全渠道品牌曝光與精準投放策略' },
      { condition: '有流量但轉化率低，ROI 不達標', result: '需要優化投放模型與著陸頁體驗' },
    ],
    faq: [
      {
        question: '你們的主要服務地區是哪裡？',
        answer: simpleLexical('我們立足香港，深耕大灣區（包括深圳、廣州、澳門等），同時具備服務國際品牌出海的能力。'),
      },
      {
        question: '合作流程是怎樣的？',
        answer: simpleLexical('通常分為四個階段：需求溝通與診斷 → 提案與報價 → 項目執行與優化 → 結案報告與復盤。'),
      },
    ],
  },
  'culture-art': {
    id: 'default-culture-art',
    slug: 'culture-art',
    title: '文化藝術業務',
    heroTitle: '文化藝術業務',
    heroDescription: '連接傳統與現代，將非物質文化遺產與商業場景深度融合，賦予品牌獨特的文化底蘊與藝術價值。',
    heroImage: '/assets/seed/culture-fabric-art.png',
    ctaTitle: '讓文化成為品牌的靈魂',
    ctaDescription: '探索非遺與商業結合的無限可能，打造具備文化厚度的品牌體驗。',
    ctaButtonText: '探索合作',
    services: [
      {
        anchorId: 'ip-licensing',
        title: '非遺 IP 授權與文創開發',
        description: '挖掘非遺美學價值，打造獨具特色的聯名產品。',
        content: simpleLexical('我們與多位國家級/省級非遺傳承人建立深度合作，提供 IP 授權、圖庫開發及文創產品設計服務，讓傳統工藝以現代設計語言重新呈現。'),
        icon: 'Palette',
        image: '/assets/seed/culture-fabric-art.png',
      },
      {
        anchorId: 'exhibition',
        title: '文化展覽與空間策劃',
        description: '打造沉浸式文化體驗空間，提升品牌藝術品味。',
        content: simpleLexical('從主題策展、空間設計到落地執行，我們為商場、酒店、企業總部等商業空間注入文化藝術元素，舉辦非遺藝術展、快閃店等吸睛活動。'),
        icon: 'MapPin',
        image: '/assets/seed/hk-street-art.png',
      },
      {
        anchorId: 'education',
        title: '文化教育與研學體驗',
        description: '傳承匠心精神，提供深度的手工藝體驗課程。',
        content: simpleLexical('面向企業團建、學校教育及公眾開放的非遺手作工坊。課程內容涵蓋剪紙、紮染、書法、陶藝等，由資深導師親自指導。'),
        icon: 'GraduationCap',
        image: '/assets/seed/charity-foundation.jpg',
      },
    ],
    ideallySuitedFor: [
      { item: '希望提升品牌文化內涵的高端消費品牌' },
      { item: '尋求差異化營銷的商業地產項目' },
      { item: '注重企業社會責任 (CSR) 的大型機構' },
    ],
    quickCheck: [
      { condition: '產品同質化嚴重，缺乏品牌故事', result: '通過非遺 IP 聯名賦予產品文化價值' },
      { condition: '線下空間缺乏人氣，體驗感單一', result: '引入文化展覽與互動體驗導流' },
    ],
    faq: [
      {
        question: '非遺合作是否只有傳統品牌才適合？',
        answer: simpleLexical('並非如此。現代科技、時尚潮流品牌與非遺的跨界碰撞往往能產生意想不到的化學反應，吸引年輕受眾。'),
      },
      {
        question: '可以定制專屬的企業禮品嗎？',
        answer: simpleLexical('當然可以。我們提供從設計、打樣到生產的非遺文創禮品全案定制服務。'),
      },
    ],
  },
}

export const defaultIndustries: Taxonomy[] = [
  { id: 'ind-1', slug: 'retail', type: 'industry', name: '零售與消費品', order: 1 },
  { id: 'ind-2', slug: 'finance', type: 'industry', name: '金融與保險', order: 2 },
  { id: 'ind-3', slug: 'real-estate', type: 'industry', name: '地產與物業', order: 3 },
  { id: 'ind-4', slug: 'technology', type: 'industry', name: '科技與互聯網', order: 4 },
  { id: 'ind-5', slug: 'culture', type: 'industry', name: '文化與旅遊', order: 5 },
  { id: 'ind-6', slug: 'education', type: 'industry', name: '教育與公益', order: 6 },
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
