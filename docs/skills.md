# 技能與工具配置

本文檔記錄項目中安裝和啟用的 skills、MCP 和工具。

## 核心技術棧

- **Next.js 14** (App Router) - React 框架
- **TypeScript** - 類型安全
- **TailwindCSS** - 樣式框架
- **shadcn/ui** - UI 組件庫
- **Payload CMS** - 內容管理系統
- **PostgreSQL** - 數據庫

## 已安裝工具

### 代碼規範與調試

- **ESLint** - JavaScript/TypeScript 代碼檢查
- **Prettier** - 代碼格式化
- **TypeScript** - 靜態類型檢查

### SEO 與內容檢查

- **audit:seo** - SEO 合規檢查腳本
- **audit:content** - 內容合規檢查（無 emoji、繁體中文等）

### 構建工具

- **assets:build** - 素材處理與清單生成
- **seed** - 數據庫初始化

## 圖標庫

- **Lucide React** - 主要圖標庫
- 其他可用：Heroicons, Font Awesome（按需引入）

## 開發規範

### 語言規範

- 前台默認語言：香港繁體中文（zh-HK）
- 預留語言：英文（en）、簡體中文（zh-Hans）
- 內容禁止：emoji、簡體中文（除非特定頁面）

### 代碼規範

- 使用 functional components
- 優先使用 server components
- 客戶端交互使用 "use client" 標記
- 統一使用 @/ 路徑別名

## 觸發條件對應的技能包

| 觸發條件 | 技能包 | 狀態 |
|---------|-------|------|
| UI/UX 專業提升 | nextlevelbuilder/ui-ux-pro-max-skill | 待引入 |
| 工程化配置 | everything-claude-code | 部分引入 |
| 文件化計劃 | 迭代管理 | 已啟用 |
| React/Next 最佳實踐 | vercel-labs/agent-skills | 已參考 |
| 瀏覽器操作 | playwright | 待啟用 |

## 備註

- 所有外部圖片必須來自 Unsplash 或 Pexels
- 用戶圖片需經過 assets:build 處理
- 需記錄所有外部素材的授權信息
