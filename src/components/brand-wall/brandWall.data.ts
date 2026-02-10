export type BrandItem = {
  name: string
  logo?: string  // Logo image path
  url?: string   // Optional website URL
}

export type BrandCategory = {
  title: string
  description: string
  color: 'gold' | 'red' | 'blue'  // Category accent color
  brands: BrandItem[]
}

// 品牌墙数据 - 基于用户提供的参考图
export const brandCategories: BrandCategory[] = [
  {
    title: '飲食 / 生活品味',
    description: '餐飲、零售、生活方式品牌',
    color: 'gold',
    brands: [
      { name: 'OpenRice', logo: '/assets/logos/brands/openrice.svg' },
      { name: 'LEMON', logo: '/assets/logos/brands/lemon.svg' },
      { name: '飲食男女', logo: '/assets/logos/brands/eatdrink.svg' },
      { name: 'U Magazine', logo: '/assets/logos/brands/umagazine.svg' },
      { name: 'Metro', logo: '/assets/logos/brands/metro.svg' },
      { name: '明周', logo: '/assets/logos/brands/mingpaoweekly.svg' },
      { name: '新假期', logo: '/assets/logos/brands/weekend.svg' },
      { name: '土炮', logo: '/assets/logos/brands/topao.svg' },
      { name: 'LINE', logo: '/assets/logos/brands/line.svg' },
      { name: 'Like', logo: '/assets/logos/brands/like.svg' },
      { name: 'SAUCE', logo: '/assets/logos/brands/sauce.svg' },
      { name: 'MEET', logo: '/assets/logos/brands/meet.svg' },
      { name: 'Timable', logo: '/assets/logos/brands/timable.svg' },
      { name: 'Cookery', logo: '/assets/logos/brands/cookery.svg' },
      { name: 'TimeOut', logo: '/assets/logos/brands/timeout.svg' },
      { name: 'Play Easy', logo: '/assets/logos/brands/playeasy.svg' },
      { name: 'Lifestyle', logo: '/assets/logos/brands/lifestyle.svg' },
      { name: 'ESO', logo: '/assets/logos/brands/eso.svg' },
      { name: 'Yahoo', logo: '/assets/logos/brands/yahoo.svg' },
      { name: 'ZTYLEZ', logo: '/assets/logos/brands/ztylez.svg' },
    ],
  },
  {
    title: '傳統媒體',
    description: '報刊、電視、電台等權威渠道',
    color: 'red',
    brands: [
      { name: '明報', logo: '/assets/logos/brands/mingpao.svg' },
      { name: '星島日報', logo: '/assets/logos/brands/singdaily.svg' },
      { name: 'on.cc', logo: '/assets/logos/brands/oncc.svg' },
      { name: '大紀元', logo: '/assets/logos/brands/epochtimes.svg' },
      { name: 'hket', logo: '/assets/logos/brands/hket.svg' },
      { name: '晴報', logo: '/assets/logos/brands/skypost.svg' },
      { name: '東周刊', logo: '/assets/logos/brands/eastweek.svg' },
      { name: 'am730', logo: '/assets/logos/brands/am730.svg' },
      { name: '文匯報', logo: '/assets/logos/brands/wenweipo.svg' },
      { name: '東方日報', logo: '/assets/logos/brands/orientaldaily.svg' },
      { name: '頭條日報', logo: '/assets/logos/brands/headline.svg' },
      { name: '730', logo: '/assets/logos/brands/730.svg' },
      { name: '信報', logo: '/assets/logos/brands/hkej.svg' },
      { name: '香港01', logo: '/assets/logos/brands/hk01.svg' },
    ],
  },
  {
    title: '跨媒體平台分享',
    description: '社交、內容、本地生活平台',
    color: 'blue',
    brands: [
      { name: 'WhatsApp', logo: '/assets/logos/brands/whatsapp.svg' },
      { name: 'Instagram', logo: '/assets/logos/brands/instagram.svg' },
      { name: 'Facebook', logo: '/assets/logos/brands/facebook.svg' },
      { name: 'Google Reviews', logo: '/assets/logos/brands/googlereviews.svg' },
      { name: '小紅書', logo: '/assets/logos/brands/xiaohongshu.svg' },
      { name: '大眾點評', logo: '/assets/logos/brands/dianping.svg' },
      { name: 'TripAdvisor', logo: '/assets/logos/brands/tripadvisor.svg' },
    ],
  },
]
