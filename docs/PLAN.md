# 項目計劃

## 項目概述

為四時鑑天下環球媒體娛樂文化股份有限公司建立企業官網，前台語言為香港繁體中文，後台使用 Payload CMS 管理內容。

## 階段規劃

### Phase 1: 項目初始化與架構搭建

- [x] 項目結構規劃
- [x] 技術棧配置（Next.js + Payload + PostgreSQL）
- [x] Docker Compose 配置
- [x] TailwindCSS + shadcn/ui 配置
- [x] i18n 配置（next-intl）
- [x] 基礎 UI 組件創建

### Phase 2: Payload CMS 內容模型

- [x] Globals: SiteSettings
- [x] Globals: Navigation
- [x] Globals: Homepage
- [x] Collections: Pages
- [x] Collections: ServicePages
- [x] Collections: Cases
- [x] Collections: Media
- [x] Collections: Leads
- [x] Collections: Taxonomies
- [x] Collections: Products, Categories, Promotions（電商地基）

### Phase 3: 前端頁面開發

- [x] Layout 組件（Header, Footer）
- [x] 首頁（Hero, Services, Cases, Partners, CTA）
- [x] 關於我們（Mission, Vision, Dual Wheel, Strengths）
- [x] 品牌廣告業務（Services, Ideally Suited For, Quick Check, FAQ）
- [x] 文化藝術業務（Services, Heritage Cloud, FAQ）
- [x] 成功案例列表（Filter, Grid）
- [x] 案例詳情頁（Background, Strategy, Results）
- [x] 聯絡我們（Form, Info, Map placeholder）

### Phase 4: 素材處理與內容生成

- [ ] assets:build 腳本完善
- [ ] 用戶圖片處理
- [ ] icon-plan.json 生成
- [ ] ASSET_LICENSES.md 記錄

### Phase 5: SEO 與合規檢查

- [x] 頁面 metadata 配置
- [x] sitemap.xml 配置
- [x] robots.txt 配置
- [x] FAQ JSON-LD 結構化數據
- [x] audit:seo 腳本
- [x] audit:content 腳本

### Phase 6: 門禁測試與修復

- [ ] pnpm lint
- [ ] pnpm typecheck
- [ ] pnpm build
- [ ] pnpm audit:seo
- [ ] pnpm audit:content

### Phase 7: 文檔與交付

- [x] README.md
- [x] .env.example
- [x] docker-compose.yml
- [ ] 最終測試與驗收

## 進度追蹤

| 階段 | 狀態 | 完成度 |
|-----|------|-------|
| Phase 1 | 已完成 | 100% |
| Phase 2 | 已完成 | 100% |
| Phase 3 | 已完成 | 100% |
| Phase 4 | 進行中 | 50% |
| Phase 5 | 已完成 | 100% |
| Phase 6 | 待開始 | 0% |
| Phase 7 | 進行中 | 80% |

## 風險與問題

1. **圖片素材**：部分案例圖片需要後續補充
2. **後台內容**：需要實際運行後填充
3. **表單功能**：需要配置 SMTP 後才能發送郵件
