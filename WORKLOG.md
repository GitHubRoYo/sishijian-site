# 工作日志 — Payload CMS 清理 & 前端稳固

**日期：** 2026-02-12
**执行者：** Claude Opus 4.6
**目标：** 完全移除 Payload CMS 残留，统一使用 Strapi，确保 Vercel 部署正常

---

## Phase 1: 清理 Payload + 稳固基础

### 任务清单

- [x] 1. 将类型定义从 `payloadApi.ts` 迁移到独立的 `src/lib/types.ts`
- [x] 2. 更新 `strapiApi.ts` — 从新 `types.ts` 导入类型（不再依赖 payloadApi）
- [x] 3. 简化 `api.ts` — 去掉 Provider 切换逻辑，直接用 Strapi
- [x] 4. 更新 `health/route.ts` — 移除 Payload 检查，改为 Strapi 健康检查
- [x] 5. 清理环境变量 (`.env`, `.env.example`, `.env.local`, `docker-compose.yml`)
- [x] 6. 删除 `src/payload/` 空目录
- [x] 7. 删除 `src/lib/payloadApi.ts`
- [x] 8. 替换 `scripts/seed.ts` (旧 Payload seed → Strapi 占位)
- [x] 9. 本地 build 验证 — 通过 (26/26 页面成功)
- [ ] 10. 更新相关文档中的 Payload 引用
- [ ] 11. 确认并 push 到 GitHub (等用户确认)

---

## 执行记录

### Step 1 — 创建 `src/lib/types.ts`
- 将所有 CMS 类型定义从 `payloadApi.ts` 迁移到独立文件
- 类型重命名：`PayloadMedia` → `Media`（更通用）
- 新增 `FindResponse<T>` 类型，供 API 层使用
- 文件大小：~160 行，覆盖所有 CMS 相关类型

### Step 2 — 重写 `src/lib/strapiApi.ts`
- 删除所有 `from './payloadApi'` 导入
- 改为从 `./types` 导入 `Media` 和 `FindResponse`
- 移除旧的 re-export 块
- 保留核心功能不变：`strapiGetGlobal`, `strapiFind`, `strapiMediaURL`

### Step 3 — 简化 `src/lib/api.ts`
- 从 90 行精简到 57 行
- 移除 Provider 检测逻辑 (`isStrapi` / `isPayload` 判断)
- 直接调用 Strapi 函数，不再走 if/else 路由
- 保留 `PayloadMedia` 作为 `Media` 的向后兼容别名（避免消费者代码报错）
- 所有页面的导入路径 `@/lib/api` 无需修改

### Step 4 — 清理其他文件
- **health/route.ts**: 重写为 Strapi 健康检查（检查 STRAPI_URL 可达性）
- **.env**: 移除 `DATABASE_URI`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_CMS_PROVIDER`
- **.env.example**: 同步更新为 Strapi-only 配置
- **.env.local**: 移除 `NEXT_PUBLIC_CMS_PROVIDER` 行（不再需要 provider 切换）
- **docker-compose.yml**: web service 环境变量改为 `NEXT_PUBLIC_STRAPI_URL`
- **scripts/seed.ts**: 替换为占位脚本（旧 1500 行 Payload seed 已移除）
- **src/payload/**: 整个目录已删除

### Step 5 — Build 验证
```
✓ Compiled successfully in 5.6s
✓ Generating static pages (26/26) in 110.3ms
所有路由正常：/, /[locale], /[locale]/about, /cases, /services, /contact, /health
```

---

## 变更文件汇总

| 操作 | 文件 |
|------|------|
| 新建 | `src/lib/types.ts` — CMS 类型定义（CMS-agnostic） |
| 重写 | `src/lib/strapiApi.ts` — 不再依赖 payloadApi |
| 重写 | `src/lib/api.ts` — Strapi-only，无 Provider 切换 |
| 重写 | `src/app/health/route.ts` — Strapi 健康检查 |
| 更新 | `.env` — 移除 Payload 变量 |
| 更新 | `.env.example` — Strapi-only 模板 |
| 更新 | `.env.local` — 移除 CMS_PROVIDER |
| 更新 | `docker-compose.yml` — 移除 Payload 环境变量 |
| 替换 | `scripts/seed.ts` — 占位脚本 |
| 删除 | `src/lib/payloadApi.ts` |
| 删除 | `src/payload/` 目录 |

---

## 后续工作 (Phase 2+)

### Phase 2: 创建缺失的 API 端点
- [ ] `POST /api/leads` — 联系表单 + Lead 弹窗提交 → Strapi Lead collection
- [ ] `POST /api/subscriptions` — Newsletter 订阅

### Phase 3: 前端完善
- [ ] About 页面接入 CMS（目前全硬编码）
- [ ] BrandWall 接入 CMS（目前 42 个 logo 硬编码在 `brandWall.data.ts`）
- [ ] ServicePageTemplate fallback bullets 迁移到 CMS

### Phase 4: 文档更新
- [ ] 更新 README.md 中的 Vercel 部署按钮（移除 PAYLOAD 环境变量）
- [ ] 更新 HANDOVER.md、VINCE_GUIDE.md 等文档中的 Payload 引用
- [ ] 清理 docs/ 目录下的旧部署文档

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

### 类型定义
- 所有 CMS 类型在 `src/lib/types.ts`
- `Media` = 媒体对象类型（图片等）
- `api.ts` 也导出 `PayloadMedia` 别名以向后兼容

### 关键环境变量
- `NEXT_PUBLIC_STRAPI_URL` — Strapi API 地址
- `STRAPI_API_TOKEN` — Strapi API Token (在 .env.local)
- `NEXT_PUBLIC_SERVER_URL` — 前端地址
