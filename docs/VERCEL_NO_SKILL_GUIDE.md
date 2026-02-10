# 我完全不会 Vercel：3 分钟上线（按这个点就行）

你只需要做 3 件事：点一个链接、粘贴 3 个变量、打开 1 个验收链接。

## 1) 点一键部署

打开下面这个链接（会跳到 Vercel，新建项目）：

https://vercel.com/new/clone?repository-url=https://github.com/GitHubRoYo/sishijian-site&env=DATABASE_URI,PAYLOAD_SECRET,SEED_SECRET,BLOB_READ_WRITE_TOKEN,PAYLOAD_PUBLIC_SERVER_URL,NEXT_PUBLIC_SERVER_URL&project-name=sishijian-site

看到 “Import”/“Deploy” 就点下去（一路默认）。

## 2) 立刻配置 3 个必须环境变量

部署完成后进入：Vercel 项目 → Settings → Environment Variables → 选择 Production。

你只要加这 3 个：

1. `DATABASE_URI`
   - 去 Supabase → Project Settings → Database → Connection string (URI)
   - 复制 **URI**（建议用 Transaction pooler），确保包含 `sslmode=require`

2. `PAYLOAD_SECRET`
   - 复制一串随机字符即可（不少于 32 位）

3. `SEED_SECRET`
   - 复制一串随机字符即可（不少于 32 位）

（可选但强烈建议）

4. `BLOB_READ_WRITE_TOKEN`
   - Vercel → Storage → Create → Blob
   - 创建后一般会自动写入；没有就从 Blob 的 Quick Start 里复制到 env

保存后，回到 Deployments，点 “Redeploy”。

提示：`PAYLOAD_PUBLIC_SERVER_URL` / `NEXT_PUBLIC_SERVER_URL` 如果你没填，系统会在 Vercel 上自动用 `VERCEL_URL` 推断（后面再补也可以）。

## 3) 一键初始化数据（让整站不空）

浏览器打开：

`https://<你的域名>/seed?token=<SEED_SECRET>`

看到 `{ ok: true }` 就说明初始化完成。

## 4) 验收链接

- 前台：`https://<你的域名>/zh-HK`
- CMS：`https://<你的域名>/admin`

## 5) 如果遇到异常（我帮你排查用）

打开：`https://<你的域名>/health`

它会告诉你：

- 哪些环境变量缺失
- `DATABASE_URI` 是否能连通（会跑一次 `select 1`）

如果你想让我继续把“媒体上传/图片持久化”也检查好：确保 Vercel 里已开 Blob 且有 `BLOB_READ_WRITE_TOKEN`。
