#!/usr/bin/env tsx
/**
 * Seed Script
 * 
 * Initializes the site with default content
 */

import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import dotenv from 'dotenv'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') })
}

type Locale = 'zh-HK' | 'en' | 'zh-Hans'

const DEFAULT_LOCALE: Locale = 'zh-HK'

const LOCALES: Locale[] = ['zh-HK', 'en', 'zh-Hans']

type LText = Record<Locale, string>

const l = (zhHK: string, en: string, zhHans: string): LText => ({
  'zh-HK': zhHK,
  en,
  'zh-Hans': zhHans,
})

const seedAssetPath = (filename: string) =>
  path.resolve(__dirname, '..', 'public', 'assets', 'seed', filename)

const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const upsertTaxonomy = async (
  payload: any,
  args: { slug: string; type: string; name: LText; description?: LText; icon?: string; order?: number },
) => {
  const existing = await payload.find({
    collection: 'taxonomies',
    where: { slug: { equals: args.slug } },
    limit: 1,
    overrideAccess: true,
  })

  const doc =
    existing.docs.length > 0
      ? existing.docs[0]
      : await payload.create({
          collection: 'taxonomies',
          data: {
            slug: args.slug,
            type: args.type,
            icon: args.icon,
            order: args.order,
            name: args.name[DEFAULT_LOCALE],
            description: args.description?.[DEFAULT_LOCALE],
          },
          locale: DEFAULT_LOCALE,
          overrideAccess: true,
        })

  await Promise.all(
    LOCALES.filter((loc) => loc !== DEFAULT_LOCALE).map((loc) =>
      payload.update({
        collection: 'taxonomies',
        id: doc.id,
        data: {
          name: args.name[loc],
          description: args.description?.[loc],
        },
        locale: loc,
        overrideAccess: true,
      }),
    ),
  )

  return doc
}

const upsertMedia = async (
  payload: any,
  args: { filename: string; alt: LText; category?: string; caption?: LText },
) => {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: args.filename } },
    limit: 1,
    overrideAccess: true,
  })

  const doc =
    existing.docs.length > 0
      ? existing.docs[0]
      : await payload.create({
          collection: 'media',
          data: {
            alt: args.alt[DEFAULT_LOCALE],
            caption: args.caption?.[DEFAULT_LOCALE],
            category: args.category || 'general',
          },
          filePath: seedAssetPath(args.filename),
          locale: DEFAULT_LOCALE,
          overrideAccess: true,
        })

  await Promise.all(
    LOCALES.filter((loc) => loc !== DEFAULT_LOCALE).map((loc) =>
      payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          alt: args.alt[loc],
          caption: args.caption?.[loc],
        },
        locale: loc,
        overrideAccess: true,
      }),
    ),
  )

  return doc
}

const upsertGlobal = async (payload: any, slug: string, dataByLocale: Record<Locale, any>) => {
  for (const loc of LOCALES) {
    await payload.updateGlobal({
      slug,
      data: dataByLocale[loc],
      locale: loc,
      overrideAccess: true,
    })
  }
}

const upsertHomepageGlobal = async (payload: any, dataByLocale: Record<Locale, any>) => {
  await payload.updateGlobal({
    slug: 'homepage',
    data: dataByLocale[DEFAULT_LOCALE],
    locale: DEFAULT_LOCALE,
    overrideAccess: true,
  })

  const base = await payload.findGlobal({
    slug: 'homepage',
    locale: DEFAULT_LOCALE,
    overrideAccess: true,
  })

  const baseServiceItems = base?.services?.items || []

  for (const loc of LOCALES.filter((l2) => l2 !== DEFAULT_LOCALE)) {
    const locData = dataByLocale[loc]
    const locServiceItems = locData?.services?.items || []

    await payload.updateGlobal({
      slug: 'homepage',
      locale: loc,
      overrideAccess: true,
      data: {
        hero: locData.hero,
        services: {
          title: locData.services?.title,
          description: locData.services?.description,
          items: baseServiceItems.map((it: any, idx: number) => ({
            id: it.id,
            icon: it.icon,
            url: it.url,
            title: locServiceItems[idx]?.title,
            description: locServiceItems[idx]?.description,
          })),
        },
        featuredCases: {
          title: locData.featuredCases?.title,
          description: locData.featuredCases?.description,
        },
        partners: {
          title: locData.partners?.title,
          description: locData.partners?.description,
        },
        cta: locData.cta,
        seo: locData.seo,
      },
    })
  }
}

const upsertNavigationGlobal = async (payload: any, dataByLocale: Record<Locale, any>) => {
  await payload.updateGlobal({
    slug: 'navigation',
    data: dataByLocale[DEFAULT_LOCALE],
    locale: DEFAULT_LOCALE,
    overrideAccess: true,
  })

  const base = await payload.findGlobal({
    slug: 'navigation',
    locale: DEFAULT_LOCALE,
    overrideAccess: true,
  })

  const baseHeader = base?.headerNav || []
  const baseFooter = base?.footerNav || []

  for (const loc of LOCALES.filter((l2) => l2 !== DEFAULT_LOCALE)) {
    const locData = dataByLocale[loc]
    const locHeader = locData?.headerNav || []
    const locFooter = locData?.footerNav || []

    await payload.updateGlobal({
      slug: 'navigation',
      locale: loc,
      overrideAccess: true,
      data: {
        headerNav: baseHeader.map((it: any, idx: number) => ({
          id: it.id,
          url: it.url,
          order: it.order,
          label: locHeader[idx]?.label,
          children:
            it.children && Array.isArray(it.children)
              ? it.children.map((c: any, cIdx: number) => ({
                  id: c.id,
                  url: c.url,
                  label: locHeader[idx]?.children?.[cIdx]?.label,
                  description: locHeader[idx]?.children?.[cIdx]?.description,
                }))
              : undefined,
        })),
        ctaButton: {
          url: base?.ctaButton?.url,
          label: locData?.ctaButton?.label,
        },
        footerNav: baseFooter.map((col: any, idx: number) => ({
          id: col.id,
          title: locFooter[idx]?.title,
          links: (col.links || []).map((ln: any, lnIdx: number) => ({
            id: ln.id,
            url: ln.url,
            label: locFooter[idx]?.links?.[lnIdx]?.label,
          })),
        })),
        footerBottom: {
          copyright: locData?.footerBottom?.copyright,
          legalLinks: base?.footerBottom?.legalLinks,
        },
      },
    })
  }
}

const upsertServicePage = async (payload: any, dataByLocale: Record<Locale, any>) => {
  const baseData = dataByLocale[DEFAULT_LOCALE]

  const existing = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: baseData.slug } },
    limit: 1,
    overrideAccess: true,
  })

  const baseDoc =
    existing.docs.length > 0
      ? await payload.update({
          collection: 'service-pages',
          id: existing.docs[0].id,
          data: baseData,
          locale: DEFAULT_LOCALE,
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'service-pages',
          data: baseData,
          locale: DEFAULT_LOCALE,
          overrideAccess: true,
        })

  const hydrated = await payload.findByID({
    collection: 'service-pages',
    id: baseDoc.id,
    locale: DEFAULT_LOCALE,
    overrideAccess: true,
  })

  for (const loc of LOCALES.filter((l2) => l2 !== DEFAULT_LOCALE)) {
    const locData = dataByLocale[loc]

    await payload.update({
      collection: 'service-pages',
      id: baseDoc.id,
      locale: loc,
      overrideAccess: true,
      data: {
        title: locData.title,
        heroTitle: locData.heroTitle,
        heroDescription: locData.heroDescription,
        ctaTitle: locData.ctaTitle,
        ctaButtonText: locData.ctaButtonText,
        seo: locData.seo,
        services: (hydrated.services || []).map((row: any, idx: number) => ({
          id: row.id,
          anchorId: row.anchorId,
          icon: row.icon,
          image: row.image?.id || row.image,
          title: locData.services?.[idx]?.title,
          description: locData.services?.[idx]?.description,
          content: locData.services?.[idx]?.content,
        })),
        ideallySuitedFor: (hydrated.ideallySuitedFor || []).map((row: any, idx: number) => ({
          id: row.id,
          item: locData.ideallySuitedFor?.[idx]?.item,
        })),
        quickCheck: (hydrated.quickCheck || []).map((row: any, idx: number) => ({
          id: row.id,
          condition: locData.quickCheck?.[idx]?.condition,
          result: locData.quickCheck?.[idx]?.result,
        })),
        faq: (hydrated.faq || []).map((row: any, idx: number) => ({
          id: row.id,
          question: locData.faq?.[idx]?.question,
          answer: locData.faq?.[idx]?.answer,
        })),
      },
    })
  }

  return baseDoc
}

const upsertCase = async (payload: any, dataByLocale: Record<Locale, any>) => {
  const data = dataByLocale[DEFAULT_LOCALE]
  const existing = await payload.find({
    collection: 'cases',
    where: { slug: { equals: data.slug } },
    limit: 1,
    overrideAccess: true,
  })

  const doc =
    existing.docs.length > 0
      ? await payload.update({
          collection: 'cases',
          id: existing.docs[0].id,
          data,
          locale: DEFAULT_LOCALE,
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'cases',
          data,
          locale: DEFAULT_LOCALE,
          overrideAccess: true,
        })

  await Promise.all(
    LOCALES.filter((loc) => loc !== DEFAULT_LOCALE).map((loc) =>
      payload.update({
        collection: 'cases',
        id: doc.id,
        data: dataByLocale[loc],
        locale: loc,
        overrideAccess: true,
      }),
    ),
  )

  return doc
}

const ensureAdminUser = async (payload: any) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sishijian.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const editorEmail = process.env.EDITOR_EMAIL || 'editor@sishijian.com'
  const editorPassword = process.env.EDITOR_PASSWORD || 'editor123'

  const shouldResetPasswords = process.env.NODE_ENV !== 'production' || process.env.RESET_SEED_USERS === 'true'

  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingAdmin.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      },
      overrideAccess: true,
    })
  } else if (shouldResetPasswords) {
    await payload.update({
      collection: 'users',
      id: existingAdmin.docs[0].id,
      data: {
        password: adminPassword,
        role: 'admin',
      },
      overrideAccess: true,
    })
  }

  const existingEditor = await payload.find({
    collection: 'users',
    where: { email: { equals: editorEmail } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingEditor.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: editorEmail,
        password: editorPassword,
        role: 'editor',
      },
      overrideAccess: true,
    })
  } else if (shouldResetPasswords) {
    await payload.update({
      collection: 'users',
      id: existingEditor.docs[0].id,
      data: {
        password: editorPassword,
        role: 'editor',
      },
      overrideAccess: true,
    })
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('Seed users (local dev):')
    console.log(`  Admin  : ${adminEmail} / ${adminPassword}`)
    console.log(`  Editor : ${editorEmail} / ${editorPassword}`)
  }
}

export async function seedDatabase() {
  console.log('Seeding database...')

  try {
    const { default: config } = await import('../src/payload.config')
    const payload = await getPayload({ config })

    await ensureAdminUser(payload)

    const businessBrand = await upsertTaxonomy(payload, {
      slug: 'brand-advertising',
      type: 'business-type',
      name: l('品牌廣告', 'Brand Advertising', '品牌广告'),
      description: l(
        '以全媒體整合營銷與本地生活深度運營，建立品牌聲量與轉化。',
        'Integrated marketing and local lifestyle operations to build awareness and conversion.',
        '以全媒体整合营销与本地生活深度运营，建立品牌声量与转化。',
      ),
      icon: 'Briefcase',
      order: 1,
    })

    const businessCulture = await upsertTaxonomy(payload, {
      slug: 'culture-art',
      type: 'business-type',
      name: l('文化藝術', 'Culture & Arts', '文化艺术'),
      description: l(
        '以非遺教育、文化游學與 IP 聯創，讓文化價值可被理解與傳播。',
        'Heritage education, cultural tours and IP co-creation to make culture understandable and shareable.',
        '以非遗教育、文化游学与 IP 联创，让文化价值可被理解与传播。',
      ),
      icon: 'Palette',
      order: 2,
    })

    const industries = [
      { name: l('餐飲', 'Food & Beverage', '餐饮'), slug: 'food', icon: 'Utensils', order: 1 },
      { name: l('零售', 'Retail', '零售'), slug: 'retail', icon: 'Store', order: 2 },
      { name: l('文旅', 'Cultural Tourism', '文旅'), slug: 'tourism', icon: 'MapPin', order: 3 },
      { name: l('時尚', 'Fashion', '时尚'), slug: 'fashion', icon: 'Shirt', order: 4 },
      { name: l('美容', 'Beauty', '美容'), slug: 'beauty', icon: 'Sparkles', order: 5 },
      { name: l('企業服務', 'Corporate Services', '企业服务'), slug: 'corporate', icon: 'Building2', order: 6 },
    ]

    const industryDocs: Record<string, any> = {}
    for (const industry of industries) {
      industryDocs[industry.slug] = await upsertTaxonomy(payload, {
        slug: industry.slug,
        type: 'industry',
        name: industry.name,
        icon: industry.icon,
        order: industry.order,
      })
    }

    const heritageItems = [
      { name: l('廣繡', 'Guang Embroidery', '广绣'), slug: 'guang-embroidery', order: 1 },
      { name: l('潮州木雕', 'Chaozhou Woodcarving', '潮州木雕'), slug: 'chaozhou-woodcarving', order: 2 },
      { name: l('德化瓷花', 'Dehua Ceramics', '德化瓷花'), slug: 'dehua-ceramics', order: 3 },
      { name: l('景泰藍', 'Cloisonné', '景泰蓝'), slug: 'cloisonne', order: 4 },
      { name: l('掐絲琺瑯', 'Filigree Enamel', '掐丝珐琅'), slug: 'filigree-enamel', order: 5 },
      { name: l('扎染', 'Tie-dye', '扎染'), slug: 'tie-dye', order: 6 },
    ]

    for (const item of heritageItems) {
      await upsertTaxonomy(payload, {
        slug: item.slug,
        type: 'intangible-heritage',
        name: item.name,
        order: item.order,
      })
    }

    const mediaHero = await upsertMedia(payload, {
      filename: 'presentation-cover-copy.png',
      alt: l(
        '四時鑑公司介紹簡報封面，用於品牌定位與雙輪驅動概念展示',
        'Sishijian company presentation cover for positioning and the dual-engine concept',
        '四时鉴公司介绍简报封面，用于品牌定位与双轮驱动概念展示',
      ),
      category: 'hero',
    })

    const mediaHK = await upsertMedia(payload, {
      filename: 'hong-kong-scenery.png',
      alt: l(
        '香港維港城市景觀照片，呈現本地視角與國際連結',
        'Hong Kong cityscape photo showing a local perspective and international connection',
        '香港维港城市景观照片，呈现本地视角与国际连接',
      ),
      category: 'hero',
    })

    const mediaCulture = await upsertMedia(payload, {
      filename: 'charity-foundation.jpg',
      alt: l(
        '公益合作活動照片，展示社會創新與文化公益的連結',
        'Charity collaboration activity photo showcasing social innovation and cultural impact',
        '公益合作活动照片，展示社会创新与文化公益的连接',
      ),
      category: 'service',
    })

    const mediaCaseCover = await upsertMedia(payload, {
      filename: 'misc-web-asset-01.jpg',
      alt: l('品牌宣傳視覺示意圖片，用於案例封面展示', 'Brand campaign visual used as a case cover', '品牌宣传视觉示意图片，用于案例封面展示'),
      category: 'case',
    })

    const mediaCaseCover2 = await upsertMedia(payload, {
      filename: 'misc-web-asset-02.jpg',
      alt: l(
        '品牌與市場推廣視覺示意圖片，用於案例封面展示',
        'Brand and marketing visual used as a case cover',
        '品牌与市场推广视觉示意图片，用于案例封面展示',
      ),
      category: 'case',
    })

    const mediaCaseCover3 = await upsertMedia(payload, {
      filename: 'misc-web-asset-03.jpg',
      alt: l(
        '文化與創作場景視覺示意圖片，用於案例封面展示',
        'Culture and creation scene visual used as a case cover',
        '文化与创作场景视觉示意图片，用于案例封面展示',
      ),
      category: 'case',
    })

    const mediaCaseCover4 = await upsertMedia(payload, {
      filename: 'misc-web-asset-04.jpg',
      alt: l(
        '品牌合作與活動場景視覺示意圖片，用於案例封面展示',
        'Brand collaboration and event scene visual used as a case cover',
        '品牌合作与活动场景视觉示意图片，用于案例封面展示',
      ),
      category: 'case',
    })

    await upsertGlobal(payload, 'site-settings', {
      'zh-HK': {
        companyName: '四時鑑天下環球媒體娛樂文化股份有限公司',
        companyNameShort: '四時鑑',
        domain: 'sishijian.com.hk',
        logo: undefined,
        favicon: undefined,
        defaultSeo: {
          title: '四時鑑 - 品牌與中國文化推廣的商業賦能平台',
          description: '四時鑑植根香港，以品牌廣告與文化藝術雙輪驅動，為企業提供一站式整合營銷與文化價值方案。',
          ogImage: mediaHero.id,
        },
        contact: {
          address: '香港',
          phone: '',
          email: 'info@sishijian.com.hk',
          businessHours: '星期一至五 09:00 - 18:00',
        },
        social: {
          facebook: 'https://www.facebook.com/',
          instagram: 'https://www.instagram.com/',
          xiaohongshu: 'https://www.xiaohongshu.com/',
          wechat: '',
          linkedin: 'https://www.linkedin.com/',
        },
        languageSettings: {
          availableLocales: [
            { code: 'zh-HK', label: '繁體中文（香港）' },
            { code: 'en', label: 'English' },
            { code: 'zh-Hans', label: '简体中文' },
          ],
        },
      },
      en: {
        companyName: 'Sishijian Global Media Entertainment & Culture Co., Ltd.',
        companyNameShort: 'Sishijian',
        domain: 'sishijian.com.hk',
        logo: undefined,
        favicon: undefined,
        defaultSeo: {
          title: 'Sishijian - A platform empowering brands through culture',
          description:
            'Based in Hong Kong, Sishijian integrates brand advertising and cultural initiatives to deliver end-to-end marketing and long-term brand value.',
          ogImage: mediaHero.id,
        },
        contact: {
          address: 'Hong Kong',
          phone: '',
          email: 'info@sishijian.com.hk',
          businessHours: 'Mon–Fri 09:00 - 18:00',
        },
        social: {
          facebook: 'https://www.facebook.com/',
          instagram: 'https://www.instagram.com/',
          xiaohongshu: 'https://www.xiaohongshu.com/',
          wechat: '',
          linkedin: 'https://www.linkedin.com/',
        },
        languageSettings: {
          availableLocales: [
            { code: 'zh-HK', label: '繁體中文（香港）' },
            { code: 'en', label: 'English' },
            { code: 'zh-Hans', label: '简体中文' },
          ],
        },
      },
      'zh-Hans': {
        companyName: '四时鉴天下环球媒体娱乐文化股份有限公司',
        companyNameShort: '四时鉴',
        domain: 'sishijian.com.hk',
        logo: undefined,
        favicon: undefined,
        defaultSeo: {
          title: '四时鉴 - 品牌与中国文化推广的商业赋能平台',
          description: '四时鉴植根香港，以品牌广告与文化艺术双轮驱动，为企业提供一站式整合营销与文化价值方案。',
          ogImage: mediaHero.id,
        },
        contact: {
          address: '香港',
          phone: '',
          email: 'info@sishijian.com.hk',
          businessHours: '周一至周五 09:00 - 18:00',
        },
        social: {
          facebook: 'https://www.facebook.com/',
          instagram: 'https://www.instagram.com/',
          xiaohongshu: 'https://www.xiaohongshu.com/',
          wechat: '',
          linkedin: 'https://www.linkedin.com/',
        },
        languageSettings: {
          availableLocales: [
            { code: 'zh-HK', label: '繁體中文（香港）' },
            { code: 'en', label: 'English' },
            { code: 'zh-Hans', label: '简体中文' },
          ],
        },
      },
    })

    await upsertNavigationGlobal(payload, {
      'zh-HK': {
        headerNav: [
          { label: '首頁', url: '/', order: 1 },
          { label: '關於我們', url: '/about', order: 2 },
          {
            label: '服務',
            url: '/services',
            order: 3,
            children: [
              { label: '品牌廣告業務', url: '/services/brand-advertising', description: '全媒體整合營銷與本地生活深度運營' },
              { label: '文化藝術業務', url: '/services/culture-art', description: '非遺教育、文化游學與 IP 聯創' },
            ],
          },
          { label: '成功案例', url: '/cases', order: 4 },
          { label: '聯絡我們', url: '/contact', order: 5 },
        ],
        ctaButton: { label: '立即諮詢', url: '/contact' },
        footerNav: [
          {
            title: '快速連結',
            links: [
              { label: '服務總覽', url: '/services' },
              { label: '成功案例', url: '/cases' },
              { label: '聯絡我們', url: '/contact' },
            ],
          },
          {
            title: '業務',
            links: [
              { label: '品牌廣告業務', url: '/services/brand-advertising' },
              { label: '文化藝術業務', url: '/services/culture-art' },
            ],
          },
        ],
        footerBottom: {
          copyright: '© 2026 四時鑑天下環球媒體娛樂文化股份有限公司 版權所有',
          legalLinks: [],
        },
      },
      en: {
        headerNav: [
          { label: 'Home', url: '/', order: 1 },
          { label: 'About', url: '/about', order: 2 },
          {
            label: 'Services',
            url: '/services',
            order: 3,
            children: [
              { label: 'Brand Advertising', url: '/services/brand-advertising', description: 'Integrated marketing and local lifestyle operations' },
              { label: 'Culture & Arts', url: '/services/culture-art', description: 'Heritage education, cultural tours and IP co-creation' },
            ],
          },
          { label: 'Cases', url: '/cases', order: 4 },
          { label: 'Contact', url: '/contact', order: 5 },
        ],
        ctaButton: { label: 'Consult Now', url: '/contact' },
        footerNav: [
          {
            title: 'Quick Links',
            links: [
              { label: 'All Services', url: '/services' },
              { label: 'Cases', url: '/cases' },
              { label: 'Contact', url: '/contact' },
            ],
          },
          {
            title: 'Business',
            links: [
              { label: 'Brand Advertising', url: '/services/brand-advertising' },
              { label: 'Culture & Arts', url: '/services/culture-art' },
            ],
          },
        ],
        footerBottom: {
          copyright: '© 2026 Sishijian. All rights reserved.',
          legalLinks: [],
        },
      },
      'zh-Hans': {
        headerNav: [
          { label: '首页', url: '/', order: 1 },
          { label: '关于我们', url: '/about', order: 2 },
          {
            label: '服务',
            url: '/services',
            order: 3,
            children: [
              { label: '品牌广告业务', url: '/services/brand-advertising', description: '全媒体整合营销与本地生活深度运营' },
              { label: '文化艺术业务', url: '/services/culture-art', description: '非遗教育、文化游学与 IP 联创' },
            ],
          },
          { label: '成功案例', url: '/cases', order: 4 },
          { label: '联系我们', url: '/contact', order: 5 },
        ],
        ctaButton: { label: '立即咨询', url: '/contact' },
        footerNav: [
          {
            title: '快速链接',
            links: [
              { label: '服务总览', url: '/services' },
              { label: '成功案例', url: '/cases' },
              { label: '联系我们', url: '/contact' },
            ],
          },
          {
            title: '业务',
            links: [
              { label: '品牌广告业务', url: '/services/brand-advertising' },
              { label: '文化艺术业务', url: '/services/culture-art' },
            ],
          },
        ],
        footerBottom: {
          copyright: '© 2026 四时鉴天下环球媒体娱乐文化股份有限公司 版权所有',
          legalLinks: [],
        },
      },
    })

    await upsertHomepageGlobal(payload, {
      'zh-HK': {
        hero: {
          title: '四時更迭，鑑往知來',
          subtitle: '以品牌廣告與文化藝術雙輪驅動，讓品牌更有分量',
          description: '四時鑑植根香港，連接內地與國際市場。我們以策略、內容與渠道整合，協助品牌建立聲量、深化信任，並以文化敘事提升長期價值。',
          backgroundImage: mediaHK.id,
          ctaPrimary: { label: '立即諮詢', url: '/contact' },
          ctaSecondary: { label: '了解更多服務', url: '/services' },
        },
        services: {
          title: '雙輪驅動，全面賦能',
          description: '以市場聲量與文化價值並行，兼顧短期轉化與長期品牌資產。',
          items: [
            { title: '品牌廣告業務', description: '全媒體整合營銷、本地生活深度運營、權威媒體傳播與公關', icon: 'Briefcase', url: '/services/brand-advertising' },
            { title: '文化藝術業務', description: '非遺教育與深度體驗、文化游學與在地探索、非遺 IP 與商業聯創', icon: 'Palette', url: '/services/culture-art' },
          ],
        },
        featuredCases: {
          title: '案例精選',
          description: '以可被理解的策略與執行，呈現品牌在不同場景中的成長路徑。案例內容可於後台補充與更新。',
          cases: [],
        },
        partners: {
          title: '合作媒體與平台',
          description: '可按專案需要覆蓋本地媒體、社交內容與本地生活平台等渠道，名錄會逐步更新。',
          logos: [
            { name: '紫荊網' },
            { name: '文匯網' },
            { name: '香港商報' },
            { name: 'TVB' },
            { name: '小紅書' },
            { name: 'Facebook' },
            { name: 'Instagram' },
            { name: '微信' },
            { name: 'Keeta' },
            { name: 'OpenRice' },
          ],
        },
        cta: {
          title: '準備好開啟您的品牌增長之旅了嗎？',
          description: '留下需求，我們會以合適的方式與您跟進。',
          buttonText: '立即諮詢',
          buttonUrl: '/contact',
        },
        seo: {
          title: '四時鑑 - 品牌與中國文化推廣的商業賦能平台',
          description: '四時鑑植根香港，以品牌廣告與文化藝術雙輪驅動，為企業提供整合營銷與文化價值方案。',
        },
      },
      en: {
        hero: {
          title: 'Seasons change, insights remain',
          subtitle: 'Two engines: Brand Advertising and Culture & Arts',
          description:
            'Based in Hong Kong, we connect mainland China and global markets. We integrate strategy, content and channels to build awareness, trust and long-term brand value.',
          backgroundImage: mediaHK.id,
          ctaPrimary: { label: 'Consult Now', url: '/contact' },
          ctaSecondary: { label: 'Explore Services', url: '/services' },
        },
        services: {
          title: 'Two engines, full capability',
          description: 'Balance short-term conversion and long-term brand equity with a unified strategy.',
          items: [
            { title: 'Brand Advertising', description: 'Integrated marketing, local lifestyle ops, media & PR', icon: 'Briefcase', url: '/services/brand-advertising' },
            { title: 'Culture & Arts', description: 'Heritage experiences, cultural tours, IP co-creation', icon: 'Palette', url: '/services/culture-art' },
          ],
        },
        featuredCases: {
          title: 'Featured Cases',
          description: 'A clear structure of background, strategy and outcomes. Content can be refined in the admin later.',
          cases: [],
        },
        partners: {
          title: 'Media & Platforms',
          description: 'Coverage can include local media, social content and lifestyle platforms. The list will evolve over time.',
          logos: [
            { name: 'Bauhinia' },
            { name: 'Wenweipo' },
            { name: 'HK Commercial Daily' },
            { name: 'TVB' },
            { name: 'Xiaohongshu' },
            { name: 'Facebook' },
            { name: 'Instagram' },
            { name: 'WeChat' },
            { name: 'Keeta' },
            { name: 'OpenRice' },
          ],
        },
        cta: {
          title: 'Ready to grow your brand?',
          description: "Tell us what you need and we'll follow up with the right approach.",
          buttonText: 'Consult Now',
          buttonUrl: '/contact',
        },
        seo: {
          title: 'Sishijian - Brand & culture growth partner',
          description: 'Based in Hong Kong, we empower brands with integrated marketing and cultural storytelling.',
        },
      },
      'zh-Hans': {
        hero: {
          title: '四时更迭，鉴往知来',
          subtitle: '以品牌广告与文化艺术双轮驱动，让品牌更有分量',
          description: '四时鉴植根香港，连接内地与国际市场。我们整合策略、内容与渠道，帮助品牌建立声量、深化信任，并以文化叙事提升长期价值。',
          backgroundImage: mediaHK.id,
          ctaPrimary: { label: '立即咨询', url: '/contact' },
          ctaSecondary: { label: '了解更多服务', url: '/services' },
        },
        services: {
          title: '双轮驱动，全面赋能',
          description: '以市场声量与文化价值并行，兼顾短期转化与长期品牌资产。',
          items: [
            { title: '品牌广告业务', description: '全媒体整合营销、本地生活深度运营、权威媒体传播与公关', icon: 'Briefcase', url: '/services/brand-advertising' },
            { title: '文化艺术业务', description: '非遗教育与深度体验、文化游学与在地探索、非遗 IP 与商业联创', icon: 'Palette', url: '/services/culture-art' },
          ],
        },
        featuredCases: {
          title: '案例精选',
          description: '以可被理解的策略与执行，呈现品牌在不同场景中的成长路径。内容可在后台补充与更新。',
          cases: [],
        },
        partners: {
          title: '合作媒体与平台',
          description: '可按项目需要覆盖本地媒体、社交内容与本地生活平台等渠道，名录会逐步更新。',
          logos: [
            { name: '紫荆网' },
            { name: '文汇网' },
            { name: '香港商报' },
            { name: 'TVB' },
            { name: '小红书' },
            { name: 'Facebook' },
            { name: 'Instagram' },
            { name: '微信' },
            { name: 'Keeta' },
            { name: 'OpenRice' },
          ],
        },
        cta: {
          title: '准备好开启您的品牌增长之旅了吗？',
          description: '留下需求，我们会以合适的方式与您跟进。',
          buttonText: '立即咨询',
          buttonUrl: '/contact',
        },
        seo: {
          title: '四时鉴 - 品牌与中国文化推广的商业赋能平台',
          description: '四时鉴植根香港，以品牌广告与文化艺术双轮驱动，为企业提供整合营销与文化价值方案。',
        },
      },
    })

    const serviceBrand = await upsertServicePage(payload, {
      'zh-HK': {
        title: '品牌廣告業務',
        slug: 'brand-advertising',
        heroTitle: '全媒體整合營銷，建立可持續的品牌聲量',
        heroDescription: '從策略到內容到渠道投放，以一致的敘事與清晰的轉化路徑，協助品牌在本地與跨境場景中獲得成長。',
        heroImage: mediaHero.id,
        services: [
          { anchorId: 'integrated', title: '全媒體整合營銷', description: '跨平台策略與內容規劃，確保訊息一致、節奏清晰。', icon: 'Radio', image: mediaHero.id },
          { anchorId: 'local-life', title: '本地生活深度運營', description: '以社群與內容營運，貼近香港消費者的日常場景。', icon: 'MapPin', image: mediaHK.id },
          { anchorId: 'pr', title: '權威媒體傳播與公關', description: '結合媒體投放、新聞議題與公關節點，提升可信度。', icon: 'Newspaper', image: mediaHero.id },
          { anchorId: 'digital', title: '品牌建設與數字化升級', description: '以數據與工具協助品牌形成可量化的營運方法。', icon: 'LineChart', image: mediaHero.id },
        ],
        ideallySuitedFor: [
          { item: '需要在香港市場快速建立品牌認知的企業' },
          { item: '希望強化社群內容與口碑的品牌' },
          { item: '需要跨平台協同投放與內容一致性的團隊' },
        ],
        quickCheck: [
          { condition: '如果您已有產品或服務，但市場認知不足', result: '那麼可從定位梳理與內容節奏先行' },
          { condition: '如果您投放預算明確，但轉化路徑不清晰', result: '那麼先重建漏斗與素材結構再放大' },
        ],
        faq: [
          {
            question: '品牌廣告業務通常需要多久看到效果？',
            answer: richText('不同專案的目標與渠道組合不同。一般建議以 4 至 8 週作為一個策略節點，先驗證訊息與渠道，再逐步擴大。'),
          },
          {
            question: '是否可以只做其中一個模組，例如公關或社群？',
            answer: richText('可以。若您已有內部團隊，我們可按缺口提供單點支援或階段性合作，並保留後續整合空間。'),
          },
          {
            question: '是否支援跨境或內地市場的協同？',
            answer: richText('支援。合作模式會按目標市場、合規與內容語境做調整，必要時以分階段方式推進。'),
          },
        ],
        ctaTitle: '想了解最適合您品牌的策略組合？',
        ctaButtonText: '立即諮詢',
        seo: {
          title: '品牌廣告業務 - 四時鑑',
          description: '四時鑑提供全媒體整合營銷、本地生活深度運營與公關傳播，協助品牌在香港與跨境場景中建立聲量與轉化。',
        },
      },
      en: {
        title: 'Brand Advertising',
        slug: 'brand-advertising',
        heroTitle: 'Integrated marketing that builds sustainable brand momentum',
        heroDescription: 'From strategy to content to media, we help brands grow across local and cross-border scenarios with clear messaging and conversion paths.',
        heroImage: mediaHero.id,
        services: [
          { anchorId: 'integrated', title: 'Integrated Marketing', description: 'Cross-platform strategy and content planning with consistent messaging.', icon: 'Radio', image: mediaHero.id },
          { anchorId: 'local-life', title: 'Local Lifestyle Operations', description: 'Community and content operations grounded in Hong Kong daily scenarios.', icon: 'MapPin', image: mediaHK.id },
          { anchorId: 'pr', title: 'Media & PR', description: 'Media placement and PR moments that build credibility and trust.', icon: 'Newspaper', image: mediaHero.id },
          { anchorId: 'digital', title: 'Digital Growth Enablement', description: 'Data and tools that support measurable operations and iteration.', icon: 'LineChart', image: mediaHero.id },
        ],
        ideallySuitedFor: [
          { item: 'Brands building awareness fast in Hong Kong' },
          { item: 'Teams strengthening social content and word-of-mouth' },
          { item: 'Organizations needing cross-channel coordination' },
        ],
        quickCheck: [
          { condition: 'If you have a product but low awareness', result: 'Then start from positioning and a clear content cadence' },
          { condition: 'If you have budget but unclear conversion', result: 'Then rebuild the funnel and creative system first' },
        ],
        faq: [
          { question: 'How soon can we see results?', answer: richText('It depends on goals and channel mix. As a baseline, we recommend 4–8 weeks to validate messaging and channels before scaling.') },
          { question: 'Can we work on a single module only?', answer: richText('Yes. We can provide focused support by stage or module, while keeping room for later integration if needed.') },
          { question: 'Do you support cross-border collaboration?', answer: richText('Yes. We tailor collaboration to target markets, compliance and language context, often in phased delivery.') },
        ],
        ctaTitle: 'Want a strategy mix that fits your brand?',
        ctaButtonText: 'Consult Now',
        seo: {
          title: 'Brand Advertising - Sishijian',
          description: 'Integrated marketing, local lifestyle operations and PR to build awareness and conversion in Hong Kong and beyond.',
        },
      },
      'zh-Hans': {
        title: '品牌广告业务',
        slug: 'brand-advertising',
        heroTitle: '全媒体整合营销，建立可持续的品牌声量',
        heroDescription: '从策略到内容到渠道投放，以一致叙事与清晰转化路径，协助品牌在本地与跨境场景中获得成长。',
        heroImage: mediaHero.id,
        services: [
          { anchorId: 'integrated', title: '全媒体整合营销', description: '跨平台策略与内容规划，确保信息一致、节奏清晰。', icon: 'Radio', image: mediaHero.id },
          { anchorId: 'local-life', title: '本地生活深度运营', description: '以社群与内容运营，贴近香港消费者的日常场景。', icon: 'MapPin', image: mediaHK.id },
          { anchorId: 'pr', title: '权威媒体传播与公关', description: '结合媒体投放、新闻议题与公关节点，提升可信度。', icon: 'Newspaper', image: mediaHero.id },
          { anchorId: 'digital', title: '品牌建设与数字化升级', description: '以数据与工具协助品牌形成可量化的运营方法。', icon: 'LineChart', image: mediaHero.id },
        ],
        ideallySuitedFor: [
          { item: '需要在香港市场快速建立品牌认知的企业' },
          { item: '希望强化社群内容与口碑的品牌' },
          { item: '需要跨平台协同投放与内容一致性的团队' },
        ],
        quickCheck: [
          { condition: '如果您已有产品或服务，但市场认知不足', result: '那么可从定位梳理与内容节奏先行' },
          { condition: '如果您投放预算明确，但转化路径不清晰', result: '那么先重建漏斗与素材结构再放大' },
        ],
        faq: [
          { question: '品牌广告业务通常需要多久看到效果？', answer: richText('不同项目的目标与渠道组合不同。一般建议以 4 至 8 周作为一个策略节点，先验证信息与渠道，再逐步扩大。') },
          { question: '是否可以只做其中一个模块，例如公关或社群？', answer: richText('可以。若您已有内部团队，我们可按缺口提供单点支持或阶段性合作，并保留后续整合空间。') },
          { question: '是否支持跨境或内地市场的协同？', answer: richText('支持。合作模式会按目标市场、合规与内容语境做调整，必要时以分阶段方式推进。') },
        ],
        ctaTitle: '想了解最适合您品牌的策略组合？',
        ctaButtonText: '立即咨询',
        seo: {
          title: '品牌广告业务 - 四时鉴',
          description: '四时鉴提供全媒体整合营销、本地生活深度运营与公关传播，协助品牌在香港与跨境场景中建立声量与转化。',
        },
      },
    })

    const serviceCulture = await upsertServicePage(payload, {
      'zh-HK': {
        title: '文化藝術業務',
        slug: 'culture-art',
        heroTitle: '以文化敘事建立品牌價值，讓內容更具深度與可傳播性',
        heroDescription: '從非遺教育、文化游學到 IP 聯創，讓文化資產以現代方式被理解、被參與，並形成可持續的合作模式。',
        heroImage: mediaCulture.id,
        services: [
          { anchorId: 'education', title: '非遺教育與深度體驗', description: '以體驗式學習與內容策劃，打造可落地的文化活動。', icon: 'GraduationCap', image: mediaCulture.id },
          { anchorId: 'tours', title: '文化游學與在地探索', description: '串連在地資源，形成具節奏與故事線的行程設計。', icon: 'Compass', image: mediaHK.id },
          { anchorId: 'ip', title: '非遺 IP 與商業聯創', description: '以聯名、授權與內容共創，將文化元素融入品牌產品與活動。', icon: 'Palette', image: mediaCulture.id },
          { anchorId: 'social', title: '公益寄售與社會創新', description: '以公益合作與可持續機制，讓影響力可被看見。', icon: 'Heart', image: mediaCulture.id },
        ],
        ideallySuitedFor: [
          { item: '希望以文化內容提升品牌長期資產的企業' },
          { item: '教育、文旅或公益機構的合作專案' },
          { item: '希望打造具辨識度的文化 IP 聯名活動' },
        ],
        quickCheck: [
          { condition: '如果您希望建立可持續的文化內容主題', result: '那麼可先從非遺主題定位與內容框架開始' },
          { condition: '如果您希望有可參與的體驗活動', result: '那麼可先設計小型體驗與試點再擴展' },
        ],
        faq: [
          {
            question: '文化藝術業務是否只限於非遺領域？',
            answer: richText('非遺是重要方向之一，但我們也可按專案需要連結不同文化資源，核心是以內容與體驗建立可傳播的價值。'),
          },
          {
            question: '是否可以先做一個小型試點？',
            answer: richText('可以。我們建議以小型試點驗證內容與參與度，再逐步擴大為系列化或長期合作。'),
          },
          {
            question: '如何避免文化內容流於表面？',
            answer: richText('我們會以研究、訪談與現場體驗建立內容深度，並在呈現方式上兼顧尊重與現代語境。'),
          },
        ],
        ctaTitle: '想把文化內容變成可合作的長期項目？',
        ctaButtonText: '立即諮詢',
        seo: {
          title: '文化藝術業務 - 四時鑑',
          description: '四時鑑提供非遺教育、文化游學與 IP 聯創服務，協助品牌與機構以文化敘事建立長期價值與可傳播內容。',
        },
      },
      en: {
        title: 'Culture & Arts',
        slug: 'culture-art',
        heroTitle: 'Cultural storytelling that builds brand value',
        heroDescription:
          'From heritage education to cultural tours and IP co-creation, we help cultural assets become understandable, participatory and sustainable.',
        heroImage: mediaCulture.id,
        services: [
          { anchorId: 'education', title: 'Heritage Education', description: 'Experience-based learning and programming with practical formats.', icon: 'GraduationCap', image: mediaCulture.id },
          { anchorId: 'tours', title: 'Cultural Tours', description: 'Connect local resources into a tour design with story and rhythm.', icon: 'Compass', image: mediaHK.id },
          { anchorId: 'ip', title: 'IP Co-creation', description: 'Co-branded content and collaborations that integrate culture into products and events.', icon: 'Palette', image: mediaCulture.id },
          { anchorId: 'social', title: 'Social Innovation', description: 'Sustainable mechanisms through NGO and community collaborations.', icon: 'Heart', image: mediaCulture.id },
        ],
        ideallySuitedFor: [
          { item: 'Brands building long-term equity through culture' },
          { item: 'Education, tourism and social impact programs' },
          { item: 'Distinctive cultural IP collaborations and events' },
        ],
        quickCheck: [
          { condition: 'If you want a sustainable content theme', result: 'Then start from topic positioning and an editorial framework' },
          { condition: 'If you want participatory experiences', result: 'Then pilot a small program before scaling' },
        ],
        faq: [
          { question: 'Is it limited to intangible heritage only?', answer: richText('Heritage is a key direction, but we connect broader cultural resources depending on the program. The core is shareable value through content and experiences.') },
          { question: 'Can we start with a small pilot?', answer: richText('Yes. We recommend pilots to validate content and participation before expanding into a series or long-term program.') },
          { question: 'How do you avoid superficial cultural content?', answer: richText('We build depth through research, interviews and field experience, and present it with respect while staying contemporary.') },
        ],
        ctaTitle: 'Want culture to become a sustainable program?',
        ctaButtonText: 'Consult Now',
        seo: {
          title: 'Culture & Arts - Sishijian',
          description: 'Heritage education, cultural tours and IP co-creation that turn cultural storytelling into long-term value.',
        },
      },
      'zh-Hans': {
        title: '文化艺术业务',
        slug: 'culture-art',
        heroTitle: '以文化叙事建立品牌价值，让内容更具深度与传播性',
        heroDescription: '从非遗教育、文化游学到 IP 联创，让文化资产以现代方式被理解、被参与，并形成可持续的合作模式。',
        heroImage: mediaCulture.id,
        services: [
          { anchorId: 'education', title: '非遗教育与深度体验', description: '以体验式学习与内容策划，打造可落地的文化活动。', icon: 'GraduationCap', image: mediaCulture.id },
          { anchorId: 'tours', title: '文化游学与在地探索', description: '串联在地资源，形成具节奏与故事线的行程设计。', icon: 'Compass', image: mediaHK.id },
          { anchorId: 'ip', title: '非遗 IP 与商业联创', description: '以联名、授权与内容共创，将文化元素融入品牌产品与活动。', icon: 'Palette', image: mediaCulture.id },
          { anchorId: 'social', title: '公益寄售与社会创新', description: '以公益合作与可持续机制，让影响力可被看见。', icon: 'Heart', image: mediaCulture.id },
        ],
        ideallySuitedFor: [
          { item: '希望以文化内容提升品牌长期资产的企业' },
          { item: '教育、文旅或公益机构的合作项目' },
          { item: '希望打造具辨识度的文化 IP 联名活动' },
        ],
        quickCheck: [
          { condition: '如果您希望建立可持续的文化内容主题', result: '那么可先从非遗主题定位与内容框架开始' },
          { condition: '如果您希望有可参与的体验活动', result: '那么可先设计小型体验与试点再扩展' },
        ],
        faq: [
          { question: '文化艺术业务是否只限于非遗领域？', answer: richText('非遗是重要方向之一，但我们也可按项目需要链接不同文化资源，核心是以内容与体验建立可传播的价值。') },
          { question: '是否可以先做一个小型试点？', answer: richText('可以。我们建议以小型试点验证内容与参与度，再逐步扩大为系列化或长期合作。') },
          { question: '如何避免文化内容流于表面？', answer: richText('我们会以研究、访谈与现场体验建立内容深度，并在呈现方式上兼顾尊重与现代语境。') },
        ],
        ctaTitle: '想把文化内容变成可合作的长期项目？',
        ctaButtonText: '立即咨询',
        seo: {
          title: '文化艺术业务 - 四时鉴',
          description: '四时鉴提供非遗教育、文化游学与 IP 联创服务，协助品牌与机构以文化叙事建立长期价值与可传播内容。',
        },
      },
    })

    const demoCase = await upsertCase(payload, {
      'zh-HK': {
        title: '示例案例：香港本地品牌整合營銷',
        slug: 'demo-hk-brand-campaign',
        cover: mediaCaseCover.id,
        businessType: 'brand-advertising',
        industry: industryDocs.food.id,
        industryTags: [industryDocs.food.id],
        summary: '以內容節奏與渠道協同，讓品牌在關鍵檔期獲得更清晰的曝光與討論。',
        background: richText('本案例為示例內容。可於後台補充品牌背景、挑戰與目標，並更新圖集素材。'),
        strategy: richText('以定位梳理、內容規劃與渠道投放協同，建立一致的品牌敘事與轉化路徑。'),
        servicesUsed: [serviceBrand.id],
        results: richText('成果以描述性語言呈現，避免捏造具體數字。可於後台補充媒體曝光、社群互動、合作回饋等內容。'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: '示例案例：香港本地品牌整合營銷 - 四時鑑',
          description: '以整合營銷方式建立一致的品牌敘事與渠道節奏，呈現可被理解的背景、策略與成果結構。',
        },
        featured: true,
        order: 1,
        status: 'published',
      },
      en: {
        title: 'Demo Case: Hong Kong Local Integrated Campaign',
        slug: 'demo-hk-brand-campaign',
        cover: mediaCaseCover.id,
        businessType: 'brand-advertising',
        industry: industryDocs.food.id,
        industryTags: [industryDocs.food.id],
        summary: 'A coordinated cadence across content and channels to amplify awareness in a key season.',
        background: richText('This is a demo structure. Replace with real background, challenges and goals in the admin.'),
        strategy: richText('Align positioning, content planning and channel execution into a consistent narrative and conversion path.'),
        servicesUsed: [serviceBrand.id],
        results: richText('Results are described qualitatively to avoid fabricating numbers. Update with real outcomes and feedback later.'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: 'Demo Case: Hong Kong Local Integrated Campaign - Sishijian',
          description: 'A clear background–strategy–outcomes structure for an integrated marketing case.',
        },
        featured: true,
        order: 1,
        status: 'published',
      },
      'zh-Hans': {
        title: '示例案例：香港本地品牌整合营销',
        slug: 'demo-hk-brand-campaign',
        cover: mediaCaseCover.id,
        businessType: 'brand-advertising',
        industry: industryDocs.food.id,
        industryTags: [industryDocs.food.id],
        summary: '以内容节奏与渠道协同，让品牌在关键档期获得更清晰的曝光与讨论。',
        background: richText('本案例为示例内容。可在后台补充品牌背景、挑战与目标，并更新图集素材。'),
        strategy: richText('以定位梳理、内容规划与渠道投放协同，建立一致的品牌叙事与转化路径。'),
        servicesUsed: [serviceBrand.id],
        results: richText('成果以描述性语言呈现，避免捏造具体数字。可在后台补充媒体曝光、社群互动、合作回馈等内容。'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: '示例案例：香港本地品牌整合营销 - 四时鉴',
          description: '以整合营销方式建立一致的品牌叙事与渠道节奏，呈现可被理解的背景、策略与成果结构。',
        },
        featured: true,
        order: 1,
        status: 'published',
      },
    })

    const shenziji = await upsertCase(payload, {
      'zh-HK': {
        title: '案例：深仔記茶餐廳推廣',
        slug: 'shenziji-cha-chaan-teng',
        cover: mediaCaseCover2.id,
        businessType: 'brand-advertising',
        industry: industryDocs.food.id,
        industryTags: [industryDocs.food.id],
        summary: '以策略、內容與渠道協同，提升檔期曝光與到店討論度。',
        background: richText('本案例為示例結構。項目背景與具體素材可在後續溝通中補充完善。'),
        strategy: richText('以內容節奏規劃、平台投放與合作資源整合，形成一致的品牌敘事與轉化路徑。'),
        servicesUsed: [serviceBrand.id],
        results: richText('成果以描述性語言呈現，避免捏造具體數字。可補充媒體曝光、社群互動、到店反饋等內容。'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: '深仔記茶餐廳推廣 - 成功案例 - 四時鑑',
          description: '以整合營銷方式呈現背景、策略與成果結構，內容可按實際資料補充與更新。',
        },
        featured: true,
        order: 2,
        status: 'published',
      },
      en: {
        title: 'Case: Shenziji Cha Chaan Teng Campaign',
        slug: 'shenziji-cha-chaan-teng',
        cover: mediaCaseCover2.id,
        businessType: 'brand-advertising',
        industry: industryDocs.food.id,
        industryTags: [industryDocs.food.id],
        summary: 'Coordinated strategy, content and channels to drive seasonal awareness and visit intent.',
        background: richText('This is a demo structure. Replace details and assets with real materials later.'),
        strategy: richText('Plan a clear cadence, execute placements and integrate partner resources into a coherent narrative.'),
        servicesUsed: [serviceBrand.id],
        results: richText('Qualitative outcomes only. Update with real PR results, engagement and feedback later.'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: 'Shenziji Cha Chaan Teng Campaign - Case - Sishijian',
          description: 'An integrated marketing case structure with background, strategy and outcomes.',
        },
        featured: true,
        order: 2,
        status: 'published',
      },
      'zh-Hans': {
        title: '案例：深仔记茶餐厅推广',
        slug: 'shenziji-cha-chaan-teng',
        cover: mediaCaseCover2.id,
        businessType: 'brand-advertising',
        industry: industryDocs.food.id,
        industryTags: [industryDocs.food.id],
        summary: '以策略、内容与渠道协同，提升档期曝光与到店讨论度。',
        background: richText('本案例为示例结构。项目背景与具体素材可在后续沟通中补充完善。'),
        strategy: richText('以内容节奏规划、平台投放与合作资源整合，形成一致的品牌叙事与转化路径。'),
        servicesUsed: [serviceBrand.id],
        results: richText('成果以描述性语言呈现，避免捏造具体数字。可补充媒体曝光、社群互动、到店反馈等内容。'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: '深仔记茶餐厅推广 - 成功案例 - 四时鉴',
          description: '以整合营销方式呈现背景、策略与成果结构，内容可按实际资料补充与更新。',
        },
        featured: true,
        order: 2,
        status: 'published',
      },
    })

    const porsche = await upsertCase(payload, {
      'zh-HK': {
        title: '案例：保時捷 × 德化瓷花聯創',
        slug: 'porsche-dehua-ceramics',
        cover: mediaCaseCover3.id,
        businessType: 'culture-art',
        summary: '以文化洞察與工藝語言，構建可被參與與傳播的聯創敘事。',
        background: richText('本案例為示例結構。具體合作範圍、素材與成果可按實際資料補充。'),
        strategy: richText('以文化主題定位、視覺敘事與體驗設計串聯，形成可落地的聯創方案。'),
        servicesUsed: [serviceCulture.id],
        results: richText('成果以描述性語言呈現，避免捏造具體數字。可補充活動回饋、內容傳播與合作亮點。'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: '保時捷 × 德化瓷花聯創 - 成功案例 - 四時鑑',
          description: '以文化藝術聯創方式呈現背景、策略與成果結構，內容可按實際資料補充。',
        },
        featured: true,
        order: 3,
        status: 'published',
      },
      en: {
        title: 'Case: Porsche × Dehua Ceramics Co-creation',
        slug: 'porsche-dehua-ceramics',
        cover: mediaCaseCover3.id,
        businessType: 'culture-art',
        summary: 'Cultural insight and craftsmanship language turned into a shareable collaboration story.',
        background: richText('This is a demo structure. Update scope, assets and outcomes with real materials later.'),
        strategy: richText('Connect cultural theme positioning, visual narrative and experience design into an executable plan.'),
        servicesUsed: [serviceCulture.id],
        results: richText('Qualitative outcomes only. Update with real feedback and highlights later.'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: 'Porsche × Dehua Ceramics Co-creation - Case - Sishijian',
          description: 'A culture & arts co-creation case structure with background, strategy and outcomes.',
        },
        featured: true,
        order: 3,
        status: 'published',
      },
      'zh-Hans': {
        title: '案例：保时捷 × 德化瓷花联创',
        slug: 'porsche-dehua-ceramics',
        cover: mediaCaseCover3.id,
        businessType: 'culture-art',
        summary: '以文化洞察与工艺语言，构建可被参与与传播的联创叙事。',
        background: richText('本案例为示例结构。具体合作范围、素材与成果可按实际资料补充。'),
        strategy: richText('以文化主题定位、视觉叙事与体验设计串联，形成可落地的联创方案。'),
        servicesUsed: [serviceCulture.id],
        results: richText('成果以描述性语言呈现，避免捏造具体数字。可补充活动回馈、内容传播与合作亮点。'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: '保时捷 × 德化瓷花联创 - 成功案例 - 四时鉴',
          description: '以文化艺术联创方式呈现背景、策略与成果结构，内容可按实际资料补充。',
        },
        featured: true,
        order: 3,
        status: 'published',
      },
    })

    const mujiushi = await upsertCase(payload, {
      'zh-HK': {
        title: '案例：木九十 × 潮州木雕聯創',
        slug: 'mujiushi-chaozhou-woodcarving',
        cover: mediaCaseCover4.id,
        businessType: 'culture-art',
        summary: '以非遺工藝美學結合品牌語境，打造具辨識度的聯名內容與體驗。',
        background: richText('本案例為示例結構。具體合作範圍、素材與成果可按實際資料補充。'),
        strategy: richText('以非遺工藝語言、產品/場景結合與內容節奏策劃，建立可持續的文化敘事。'),
        servicesUsed: [serviceCulture.id],
        results: richText('成果以描述性語言呈現，避免捏造具體數字。可補充傳播亮點、活動回饋與合作延展方向。'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: '木九十 × 潮州木雕聯創 - 成功案例 - 四時鑑',
          description: '以文化藝術聯創方式呈現背景、策略與成果結構，內容可按實際資料補充。',
        },
        featured: true,
        order: 4,
        status: 'published',
      },
      en: {
        title: 'Case: Mujioshi × Chaozhou Woodcarving Co-creation',
        slug: 'mujiushi-chaozhou-woodcarving',
        cover: mediaCaseCover4.id,
        businessType: 'culture-art',
        summary: 'Heritage aesthetics aligned with brand context to create distinctive co-branded content and experiences.',
        background: richText('This is a demo structure. Update scope, assets and outcomes with real materials later.'),
        strategy: richText('Combine craftsmanship language with product and scene design, supported by a clear content cadence.'),
        servicesUsed: [serviceCulture.id],
        results: richText('Qualitative outcomes only. Update with real highlights and feedback later.'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: 'Mujioshi × Chaozhou Woodcarving Co-creation - Case - Sishijian',
          description: 'A culture & arts co-creation case structure with background, strategy and outcomes.',
        },
        featured: true,
        order: 4,
        status: 'published',
      },
      'zh-Hans': {
        title: '案例：木九十 × 潮州木雕联创',
        slug: 'mujiushi-chaozhou-woodcarving',
        cover: mediaCaseCover4.id,
        businessType: 'culture-art',
        summary: '以非遗工艺美学结合品牌语境，打造具辨识度的联名内容与体验。',
        background: richText('本案例为示例结构。具体合作范围、素材与成果可按实际资料补充。'),
        strategy: richText('以非遗工艺语言、产品/场景结合与内容节奏策划，建立可持续的文化叙事。'),
        servicesUsed: [serviceCulture.id],
        results: richText('成果以描述性语言呈现，避免捏造具体数字。可补充传播亮点、活动回馈与合作延展方向。'),
        gallery: [],
        relatedCases: [],
        seo: {
          title: '木九十 × 潮州木雕联创 - 成功案例 - 四时鉴',
          description: '以文化艺术联创方式呈现背景、策略与成果结构，内容可按实际资料补充。',
        },
        featured: true,
        order: 4,
        status: 'published',
      },
    })

    await payload.updateGlobal({
      slug: 'homepage',
      locale: DEFAULT_LOCALE,
      overrideAccess: true,
      data: {
        featuredCases: {
          cases: [demoCase.id, shenziji.id, porsche.id, mujiushi.id],
        },
      },
    })
    
    console.log('\nSeeding complete!')
    return { ok: true }
    
  } catch (error) {
    console.error('Seeding failed:', error)
    return { ok: false, error }
  }
}

async function seedCLI() {
  const result = await seedDatabase()
  process.exit(result.ok ? 0 : 1)
}

const isCLI = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (isCLI) {
  seedCLI()
}
