# 故障排查記錄

## 問題 1：資料庫連接失敗（`pg` 模組缺失）

### 症狀
- `/health` 端點返回 `{"db":{"ok":false,"error":"Cannot find module 'pg'}}`
- API 端點返回 404
- 前台頁面載入但無動態資料

### 原因
`@payloadcms/db-postgres` 依賴 `pg`（node-postgres）驅動，但 `pg` 未列入 `package.json` 的 `dependencies`。

### 修復
```bash
pnpm add pg
```

### 驗證
```bash
curl http://localhost:3000/health
# 應返回 {"ok":true,"db":{"ok":true},...}
```

## 問題 2：Admin 頁面 NEXT_REDIRECT 錯誤日誌

### 症狀
開發伺服器日誌中出現：
```
Error: NEXT_REDIRECT
  digest: 'NEXT_REDIRECT;replace;/admin/login?redirect=%2Fadmin%2F;307;'
```

### 原因
這是 Payload CMS 的正常行為。未登入時訪問 `/admin` 會觸發 Next.js 的 redirect，在開發模式下會在控制台顯示為 unhandledRejection，但實際功能正常。

### 解決
無需處理，這是預期行為。登入後該錯誤不再出現。

## 問題 3：Admin 404 錯誤（路由衝突）

### 症狀
- 訪問 `/admin` 返回 404 頁面
- 登入後仍然顯示 404
- 瀏覽器控制台顯示路由錯誤

### 原因
存在重複的 admin 路由目錄：
- `/app/(payload)/admin` - Payload CMS 的正確 admin 路由
- `/app/(site)/[locale]/admin` - 錯誤創建的路由，導致路由衝突

Next.js 的路由優先級使得 `(site)/[locale]/admin` 攔截了 `/admin` 請求，導致 Payload CMS 無法正常工作。

### 修復
刪除錯誤的 admin 目錄：
```bash
rm -rf src/app/(site)/[locale]/admin
```

### 驗證
```bash
curl -I http://localhost:3000/admin
# 應返回 HTTP/1.1 200 OK
# 並且可以正常訪問 Payload CMS 登入頁面
```

### 根本原因
在創建多語言路由結構時，錯誤地在 `[locale]` 下創建了 admin 目錄。Payload CMS 的 admin 應該獨立於語言路由，直接在 `(payload)` 路由組下。

## 環境確認清單

| 檢查項 | 命令 | 預期結果 |
|--------|------|----------|
| Node.js 版本 | `node -v` | >= 18.0.0 |
| pnpm 可用 | `pnpm -v` | 版本號 |
| Docker 運行 | `docker ps` | 看到 sishijian-db 容器 |
| PostgreSQL 健康 | `docker-compose ps` | postgres: healthy |
| 端口 3000 空閒 | `lsof -ti:3000` | 無輸出（或只有 dev server） |
| 端口 5432 可用 | `docker-compose ps` | postgres: 0.0.0.0:5432->5432 |
| 環境變量完整 | `curl localhost:3000/health` | ok: true |
| Admin 可訪問 | `curl -I localhost:3000/admin` | HTTP/1.1 200 OK |
