# 專案操作指南 (For Vince)

這份文件是專門為您準備的「傻瓜式操作手冊」，涵蓋了啟動、管理內容、發布網站的所有步驟。

> **✅ 最新狀態 (2026-02-10)**: 
> - **GitHub**: 倉庫已修復並成功連接。
> - **Vercel**: 首頁 404 問題已通過新增 `page.tsx` 修復。
> - **CMS**: API 權限已自動配置。

## 1. 最後一步：連接 Vercel (Final Connection)

您已經成功部署了後端！現在請去 Vercel 的 Settings -> Environment Variables 填入以下內容：

| 變量名 (Key) | 值 (Value) |
| :--- | :--- |
| `NEXT_PUBLIC_CMS_PROVIDER` | `strapi` |
| `NEXT_PUBLIC_STRAPI_URL` | `https://mighty-ants-3f2eafb335.strapiapp.com` |

填好後，記得在 Deployments 頁面點 Redeploy (重新部署)。

## 2. 快速啟動 (One-Click Start)

我已經為您準備了兩個自動化腳本，您只需要在 Finder (文件夾) 中找到它們並雙擊，或者在終端機運行。

### 啟動後台 (CMS)
- **位置**: `/Users/vince/Documents/sishijian-cms/start_cms.sh`
- **功能**: 自動安裝依賴並啟動 Strapi 後台。
- **操作**: 
  1. 打開終端機。
  2. 輸入 `sh /Users/vince/Documents/sishijian-cms/start_cms.sh` 並按 `Enter`。
  3. 等待幾分鐘，瀏覽器會自動彈出 `http://localhost:1337/admin`。

### 啟動網站 (Website)
- **位置**: `/Users/vince/Documents/sishijian-site/start_website.sh`
- **功能**: 啟動 Next.js 前端網站。
- **操作**:
  1. 打開一個 **新** 的終端機視窗。
  2. 輸入 `sh /Users/vince/Documents/sishijian-site/start_website.sh` 並按 `Enter`。
  3. 等待幾分鐘，瀏覽器會彈出 `http://localhost:3000`。

## 2. 管理內容 (CMS Content)

1. **登入後台**: 訪問 `http://localhost:1337/admin`。
2. **切換語言**: 點擊左下角頭像 -> Profile -> Interface Language -> **Chinese (Simplified)**。
3. **填寫內容**:
   - 點擊左側 **Content Manager** (內容管理)。
   - 選擇 **Homepage** (首頁) 或 **Case** (案例)。
   - 點擊 **Create new entry** (新建)，像填表格一樣輸入標題、圖片、描述。
   - 記得點擊右上角的 **Save** (保存) 和 **Publish** (發布)。

## 3. 發布上線 (Evaluate & Deploy)

### GitHub (代碼託管)
您已經提供了 Token (`ghp_...`)，我已經將它安全地存在了 `.env.local` 文件中。

要將代碼推送到 GitHub，請在終端機運行以下命令 (一次性設定)：
```bash
cd /Users/vince/Documents/sishijian-site
# 如果還沒初始化 git
git init
git add .
git commit -m "First commit"
git branch -M main
# 替換您的 GitHub 用戶名
git remote add origin https://github.com/YOUR_USERNAME/sishijian-site.git
git push -u origin main
```

### Vercel (網站部署 - Frontend)
這是最簡單的發布方式：
1. 去 [Vercel.com](https://vercel.com) 註冊一個帳號。
2. 點擊 **Add New Project**。
3. 選擇 **Import Git Repository** 並連接您的 GitHub。
4. 選擇 `sishijian-site` 專案 (如果沒看到，請先運行下面的 `deploy.sh` 腳本)。
5. **重要設定**：在 Environment Variables (環境變數) 裡，填入：
   - `NEXT_PUBLIC_CMS_PROVIDER`: `strapi`
   - `NEXT_PUBLIC_STRAPI_URL`: (填入您部署好的 CMS 網址，見下文)
6. 點擊 **Deploy**。

### Strapi Cloud (後台部署 - Backend)
這是官方託管服務，最適合新手，一鍵部署。
1. 運行我為您準備的腳本：
   `/bin/sh /Users/vince/Documents/sishijian-cms/deploy_cms_cloud.sh`
2. 瀏覽器會彈出，請註冊/登入 Strapi Cloud。
3. 跟隨指引創建專案。
4. 部署完成後，您會獲得一個類似 `https://sishijian-cms.strapi.app` 的網址。
5. **請把這個網址填回到 Vercel 的環境變數裡。**

## 4. Figma 與設計
您提供的 Figma Token (`figd_...`) 也已保存。
如果您需要我根據特定設計圖修改網站，請直接發送 Figma 文件的鏈接給我 (例如 `https://www.figma.com/file/xxxxx`)，我就可以讀取設計並自動幫您寫代碼。

## 常見問題
- **報錯 "EADDRINUSE"**: 表示端口被佔用了。請關閉所有終端機視窗，重新執行腳本。
- **網站看不到內容**: 請確認 CMS 的內容狀態是 **Published** (已發布)，而不是 Draft (草稿)。
