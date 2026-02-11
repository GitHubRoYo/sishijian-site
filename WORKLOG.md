# 工作日志 — Payload CMS 清理 & 前端稳固

**日期：** 2026-02-12
**执行者：** Claude Opus 4.6
**目标：** 完全移除 Payload CMS 残留，统一使用 Strapi，确保 Vercel 部署正常

---

## 总进度表

| Phase | 状态 | 说明 |
|-------|------|------|
| Phase 1: 清理 Payload | 已完成 | 源码零 Payload 残留，build 通过 |
| Phase 2: 创建 API 端点 | 已完成 | `/api/leads` + `/api/subscriptions` |
| Phase 3: 文档更新 | 已完成 | README/HANDOVER/VINCE_GUIDE/SITE_MAP 更新，旧文档删除 |

---

## Phase 1: 清理 Payload + 稳固基础

### 任务清单

- [x] 1. 将类型定义从 `payloadApi.ts` 迁移到独立的 `src/lib/types.ts`
- [x] 2. 更新 `strapiApi.ts` — 从新 `types.ts` 导入类型
- [x] 3. 简化 `api.ts` — 去掉 Provider 切换逻辑，直接用 Strapi
- [x] 4. 更新 `health/route.ts` — Strapi 健康检查
- [x] 5. 清理环境变量
- [x] 6. 删除 `src/payload/` 空目录
- [x] 7. 删除 `src/lib/payloadApi.ts`
- [x] 8. 替换 `scripts/seed.ts`
- [x] 9. 本地 build 验证 — 通过 (26/26)
- [x] 10. 推送到 GitHub (commit: b1746e0)

## Phase 2: 创建缺失的 API 端点

- [x] `POST /api/leads` — 联系表单 + Lead 弹窗 → Strapi Lead collection
- [x] `POST /api/subscriptions` — Newsletter 订阅 (含重复检测 409)

## Phase 3: 文档更新

- [x] `README.md` — 重写为 Strapi-only，更新项目结构和部署说明
- [x] `HANDOVER.md` — 重写架构说明、数据流图、组件表、TODO 列表
- [x] `VINCE_GUIDE.md` — 移除 CMS_PROVIDER 引用
- [x] `OPERATIONS_GUIDE.md` — 移除 CMS_PROVIDER 引用
- [x] `SITE_MAP.md` — 更新数据流图和文件结构
- [x] 删除旧文档: `SYNC_DEBUG_REPORT.md`, `README_LOCALHOST.md`, `docs/ACCEPTANCE_CHECKLIST.md`, `docs/DEPLOY_VERCEL.md`, `docs/VERCEL_NO_SKILL_GUIDE.md`

---

## 全部变更文件汇总

| 操作 | 文件 | 说明 |
|------|------|------|
| 新建 | `src/lib/types.ts` | CMS 类型定义 (Media, CaseDoc, etc.) |
| 新建 | `src/app/api/leads/route.ts` | 联系表单 API → Strapi |
| 新建 | `src/app/api/subscriptions/route.ts` | Newsletter API → Strapi |
| 新建 | `WORKLOG.md` | 本工作日志 |
| 重写 | `src/lib/api.ts` | Strapi-only (90→57行) |
| 重写 | `src/lib/strapiApi.ts` | 不再依赖 payloadApi |
| 重写 | `src/app/health/route.ts` | Strapi 健康检查 |
| 重写 | `README.md` | Strapi-only 项目说明 |
| 重写 | `HANDOVER.md` | 更新架构和 TODO |
| 更新 | `VINCE_GUIDE.md` | 移除 CMS_PROVIDER |
| 更新 | `OPERATIONS_GUIDE.md` | 移除 CMS_PROVIDER |
| 更新 | `SITE_MAP.md` | 更新数据流和文件结构 |
| 更新 | `.env` | 移除 Payload 变量 |
| 更新 | `.env.example` | Strapi-only 模板 |
| 更新 | `.env.local` | 移除 CMS_PROVIDER |
| 更新 | `docker-compose.yml` | 移除 Payload 环境变量 |
| 替换 | `scripts/seed.ts` | 占位脚本 (1500→19行) |
| 删除 | `src/lib/payloadApi.ts` | Payload API 适配器 |
| 删除 | `src/payload/` 目录 | 空目录 |
| 删除 | `SYNC_DEBUG_REPORT.md` | 过时的 Payload 调试文档 |
| 删除 | `README_LOCALHOST.md` | 过时的本地启动文档 |
| 删除 | `docs/ACCEPTANCE_CHECKLIST.md` | 过时的 Payload 验收清单 |
| 删除 | `docs/DEPLOY_VERCEL.md` | 过时的 Payload 部署文档 |
| 删除 | `docs/VERCEL_NO_SKILL_GUIDE.md` | 过时的 Payload 部署文档 |

---

## Build 验证结果

```
✓ Next.js 16.1.6 (Turbopack)
✓ Compiled successfully in 5.3s
✓ Generating static pages (28/28) in 209.4ms

Routes:
  ○ /                          (static redirect → /zh-HK)
  ƒ /[locale]                  (homepage)
  ƒ /[locale]/about            (about page)
  ƒ /[locale]/cases            (cases listing)
  ƒ /[locale]/cases/[slug]     (case detail)
  ƒ /[locale]/contact          (contact form)
  ƒ /[locale]/services         (services overview)
  ƒ /[locale]/services/brand-advertising
  ƒ /[locale]/services/culture-art
  ƒ /api/leads                 (NEW - lead form API)
  ƒ /api/subscriptions         (NEW - newsletter API)
  ƒ /health                    (Strapi health check)
```

---

## 架构说明（给接手的 AI）

### 数据流
```
页面组件 (src/app/[locale]/*)
  ↓ import from
@/lib/api (统一入口，直接调用 Strapi)
  ↓ 调用
@/lib/strapiApi (Strapi REST API 适配器)
  ↓ fetch
Strapi 5 (localhost:1337 / 生产环境 URL)
  ↓ 数据为空时
@/lib/defaultContent (硬编码降级内容)
```

### 表单提交流
```
ContactForm / LeadCaptureDialog
  ↓ POST
/api/leads (Next.js API Route)
  ↓ forward
Strapi POST /api/leads (Lead collection)

NewsletterForm
  ↓ POST
/api/subscriptions (Next.js API Route)
  ↓ check duplicate → forward
Strapi POST /api/subscriptions
```

### 类型定义
- 所有 CMS 类型在 `src/lib/types.ts`
- `Media` = 媒体对象类型（图片等）
- `api.ts` 也导出 `PayloadMedia` 别名以向后兼容

### 关键环境变量
- `NEXT_PUBLIC_STRAPI_URL` — Strapi API 地址
- `STRAPI_API_TOKEN` — Strapi API Token (在 .env.local)
- `NEXT_PUBLIC_SERVER_URL` — 前端地址

---

## 后续待办（未完成的工作）

### 优先级高
- [ ] 在 Strapi 中创建 `Subscription` collection（用于 Newsletter 订阅）
- [ ] 在 Vercel 环境变量中设置 `NEXT_PUBLIC_STRAPI_URL` 和 `STRAPI_API_TOKEN`
- [ ] 确认 Strapi CMS 中已有实际内容数据

### 优先级中
- [ ] About 页面接入 CMS（目前全硬编码）
- [ ] BrandWall 接入 CMS（目前 42 个 logo 硬编码在 `brandWall.data.ts`）

### 优先级低
- [ ] ServicePageTemplate fallback bullets 迁移到 CMS
- [ ] 添加 Google Analytics
- [ ] 清理 node_modules 中残留的 @payloadcms 包 (`pnpm install` 后自动清理)
