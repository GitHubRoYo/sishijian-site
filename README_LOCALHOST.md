# 本地開發環境啟動指南

## 環境要求

- **Node.js** >= 18.0.0
- **pnpm** (推薦) 或 npm
- **Docker** (用於 PostgreSQL 資料庫)

## 一鍵啟動

### 1. 啟動資料庫

```bash
docker-compose up -d postgres
```

等待健康檢查通過（約 5 秒）：

```bash
docker-compose ps
# sishijian-db 狀態應為 healthy
```

### 2. 安裝依賴

```bash
pnpm install
```

### 3. 配置環境變量

複製 `.env.example` 為 `.env`（如不存在）：

```bash
cp .env.example .env
```

默認配置已可直接使用，無需修改。

### 4. 啟動開發服務器

```bash
pnpm dev
```

### 5. 訪問地址

| 頁面 | 地址 |
|------|------|
| 前台首頁 | http://localhost:3000/zh-HK |
| 前台英文版 | http://localhost:3000/en |
| 前台簡體版 | http://localhost:3000/zh-Hans |
| 後台管理 | http://localhost:3000/admin |
| API 健康檢查 | http://localhost:3000/health |
| GraphQL | http://localhost:3000/graphql |

### 6. 後台登入

- 郵箱：`admin@sishijian.com`
- 密碼：`admin123`

如帳號不存在，需先運行 seed：

```bash
pnpm seed
```

或訪問 http://localhost:3000/seed（需在 `.env` 設定 `SEED_SECRET`）。

## Docker 全容器啟動（替代方案）

```bash
docker-compose up --build
```

此命令會同時啟動 PostgreSQL 和 Next.js 應用。

## 常見問題

- 端口 3000 被佔用：`lsof -ti:3000 | xargs kill`
- 端口 5432 被佔用：`docker-compose down && docker-compose up -d postgres`
- 資料庫連接失敗：確認 Docker 容器正在運行 `docker ps`

## 環境變量說明

見 `.env.example` 文件，必要字段：

| 變量 | 必須 | 說明 |
|------|------|------|
| `DATABASE_URI` | 是 | PostgreSQL 連接字串 |
| `PAYLOAD_SECRET` | 是 | Payload CMS 加密密鑰 |
| `NEXT_PUBLIC_SERVER_URL` | 是 | 前端服務器 URL |
| `PAYLOAD_PUBLIC_SERVER_URL` | 是 | Payload API URL |
| `ADMIN_EMAIL` | 否 | Seed 用管理員郵箱 |
| `ADMIN_PASSWORD` | 否 | Seed 用管理員密碼 |
| `BLOB_READ_WRITE_TOKEN` | 否 | Vercel Blob（生產環境） |
