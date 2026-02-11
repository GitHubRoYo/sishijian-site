# SISHIJIAN 项目操作指南

本文档包含了项目的本地及生产环境链接、账户管理、同步验证指南，以及 AI Gateway 演示的设置说明。

## 1. 环境链接 (Environment Links)

### 🚀 生产/线上环境 (Production) -【关键部分】
这是您给客户和用户访问的链接。由于我是运行在您本地电脑的助手，我无法直接获取您的云端账号信息，**请根据以下指引获取并更新到文档中**。

*   **前端页面 (Vercel)**:
    *   **链接**: (待填入，例如 `https://sishijian-site.vercel.app`)
    *   **获取方式**: 访问 [Vercel Dashboard](https://vercel.com/dashboard) -> 选择项目 `sishijian-site` -> 这里的 Deployment URL 就是您的链接。
*   **CMS 后端 (Strapi Cloud / VPS)**:
    *   **链接**: (待填入，例如 `https://my-cms-project.strapi.app`)
    *   **获取方式**: 访问 [Strapi Cloud](https://cloud.strapi.io) 或者您的服务器 IP/域名。

> **警告**: 如果您还没部署 CMS 到线上，Vercel 上的前端页面是无法连接到您本地电脑的 Strapi 的！必须先部署 Strapi。

### 🟢 本地开发环境 (Local Development)
用于日常开发和调试。

*   **CMS API & 管理后台**: [http://localhost:1337/admin](http://localhost:1337/admin)
    *   (这是后端数据源)
*   **CMS API 地址**: [http://localhost:1337](http://localhost:1337)
*   **前端预览页面**: [http://localhost:3000](http://localhost:3000)
    *   *状态*: ✅ 已验证可连接到本地 Strapi

## 2. 账号与凭证 (Accounts & Credentials)

### Strapi CMS (本地管理员)
*   **账户**: (这是您首次启动 `npm run develop` 时设置的邮箱)
*   **密码**: (您设置的密码)
*   **重置密码**: 如果忘记密码，请在终端 (`sishijian-cms` 目录) 运行：
    ```bash
    npm run strapi admin:reset-user-password -- --email="您的邮箱" --password="新密码"
    ```

### Vercel / Strapi Cloud
*   **账户**: 通常为您用于注册服务的 GitHub 或 Email 账号。

## 3. 确保前后端同步 (Synchronization)

### ✅ 本地同步检查 (已修复)
目前本地配置已正确，前端指向 Strapi。
*   文件: `sishijian-site/.env.local`
*   配置: `NEXT_PUBLIC_STRAPI_URL="http://localhost:1337"`

### ⚠️ 生产环境同步检查 (必须手动配置！)
**为了让线上的 Vercel 页面正常显示内容，您必须在 Vercel 后台配置环境变量。**

1.  进入 Vercel 项目设置 -> **Settings** -> **Environment Variables**。
2.  添加/更新以下变量，**必须填写真实有效的线上 CMS 地址**：
    *   `NEXT_PUBLIC_STRAPI_URL` = **[您的线上 Strapi 域名]** (例如 `https://cms.sishijian.com` 或 `https://xxxx.strapi.app`)
    *   `STRAPI_API_TOKEN` = **[您的 Strapi API Token]**
    *   **注意**: 绝对不能填 `localhost`，否则线上用户访问不到。
3.  **重新部署 (Redeploy)** 项目以使变量生效。

## 4. AI Gateway Demo

已为您在 `demo` 目录设置演示项目。

### 运行步骤
1.  **准备 API Key**: 获取您的 AI Gateway 密钥。
2.  **配置密钥**: 打开文件 `sishijian-site/demo/.env`，填入：
    ```env
    AI_GATEWAY_API_KEY=sk-xxxx-您的密钥
    ```
3.  **运行脚本**:
    ```bash
    # 在 sishijian-site 根目录下运行
    npx tsx demo/gateway.ts
    ```
