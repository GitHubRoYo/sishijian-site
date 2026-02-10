# Vercel 验收清单

## 0) 安全

- GitHub Token 已撤销（如果曾在聊天里发过 token，一定要撤销）

## 1) 数据库

- `DATABASE_URI` 指向生产 Postgres（Supabase/Neon/Vercel Postgres 均可）
- 连接串包含 `sslmode=require`（Supabase 常见需要）

## 2) Vercel 环境变量

- `PAYLOAD_SECRET` 已设置（强随机）
- `PAYLOAD_PUBLIC_SERVER_URL` = `https://<domain>`
- `NEXT_PUBLIC_SERVER_URL` = `https://<domain>`
- `NEXT_PUBLIC_DEFAULT_LOCALE` = `zh-HK`
- `NEXT_PUBLIC_LOCALES` = `zh-HK,en,zh-Hans`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `EDITOR_EMAIL` / `EDITOR_PASSWORD`

## 3) 媒体存储（必须）

- Vercel Storage 已创建 **Blob**
- `BLOB_READ_WRITE_TOKEN` 存在于 Production 环境变量

## 4) 初始化数据

- 已对生产数据库执行过 `pnpm seed`
  - 运行 seed 的环境需要同时配置：`DATABASE_URI` + `BLOB_READ_WRITE_TOKEN`

## 5) 页面验收

- 前台（中文繁体）：`/zh-HK`
- 服务页：`/zh-HK/services/brand-advertising`、`/zh-HK/services/culture-art`
- 关于我们：`/zh-HK/about`
- CMS 登录：`/admin/login`
- CMS 首页：`/admin`

## 6) CMS → 前台同步

- 在 CMS 修改 `Navigation` / `Homepage` / `Service Pages` 任意字段
- 前台刷新后能看到变更

