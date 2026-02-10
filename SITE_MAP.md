# 四时鉴网站完整地图

## 📱 所有可以访问的页面（本地开发环境）

> **开发服务器地址：** http://localhost:3000  
> **提示：** 网站支持3种语言，只需改变网址里的语言代码即可

### 🌍 支持的语言

| 语言代码 | 语言名称 | 示例链接 |
|---------|---------|---------|
| `zh-HK` | 繁体中文（香港） | http://localhost:3000/zh-HK |
| `en` | 英文 | http://localhost:3000/en |
| `zh-Hans` | 简体中文 | http://localhost:3000/zh-Hans |

---

## 🏠 首页

**繁体中文：** http://localhost:3000/zh-HK  
**英文：** http://localhost:3000/en  
**简体中文：** http://localhost:3000/zh-Hans

**也可以直接访问：** http://localhost:3000（会自动跳转到默认语言）

---

## 📄 服务页面

### 服务总览页
**繁体：** http://localhost:3000/zh-HK/services  
**英文：** http://localhost:3000/en/services

> 这个页面展示两大业务板块的卡片，点击可以进入详细页

### 品牌广告业务详情页
**繁体：** http://localhost:3000/zh-HK/services/brand-advertising  
**英文：** http://localhost:3000/en/services/brand-advertising

> 包含：媒体发布、本地营销、公关传播、数字营销等服务模块

### 文化艺术业务详情页
**繁体：** http://localhost:3000/zh-HK/services/culture-art  
**英文：** http://localhost:3000/en/services/culture-art

> 包含：非遗课程、文化游学、文创开发、公益展览等服务模块

---

## 📚 案例展示页面

### 案例列表页（带筛选功能）
**繁体：** http://localhost:3000/zh-HK/cases  
**英文：** http://localhost:3000/en/cases

> 可以按业务类型（品牌广告/文化艺术）和行业筛选案例

### 单个案例详情页
**繁体：** http://localhost:3000/zh-HK/cases/[案例标识]  
**英文：** http://localhost:3000/en/cases/[案例标识]

> `[案例标识]` 是动态的，取决于数据库里的案例数据
> 例如：http://localhost:3000/zh-HK/cases/example-case

---

## ℹ️ 关于我们页面

**繁体：** http://localhost:3000/zh-HK/about  
**英文：** http://localhost:3000/en/about

> 包含：公司使命、愿景、双轮驱动模式、核心优势、公司故事

---

## ✉️ 联系我们页面

**繁体：** http://localhost:3000/zh-HK/contact  
**英文：** http://localhost:3000/en/contact

> 包含：联系表单、公司地址、电话、邮箱、营业时间

---

## 🏗️ 网站技术架构（给开发者看的）

### 前端技术栈

```
┌─────────────────────────────────────┐
│       用户在浏览器看到的网页          │
│    (Next.js 16 + React 组件)        │
└──────────────┬──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │   样式和交互效果       │
    │  • Tailwind CSS      │
    │  • Radix UI 组件      │
    │  • 自定义动画系统      │
    └──────────────────────┘
```

### 数据获取流程（重要！）

```
前端页面需要数据
     │
     ▼
调用 src/lib/api.ts (统一接口)
     │
     ├────→ 读取环境变量 NEXT_PUBLIC_CMS_PROVIDER
     │
     ├─ 如果是 "payload" ──→ src/lib/payloadApi.ts ──→ Payload 数据库
     │
     └─ 如果是 "strapi" ──→ src/lib/strapiApi.ts ──→ Strapi 数据库
```

**现在的状态：** 使用 Payload 数据库（默认）  
**未来可以切换到：** Strapi 数据库（需要先在 Strapi 里创建内容）

### 多语言支持

使用 `next-intl` 库实现：
- 网址格式：`/[语言代码]/[页面路径]`
- 翻译文件存放在：`src/messages/` 目录下
- 支持的语言：繁体中文(zh-HK)、英文(en)、简体中文(zh-Hans)

---

## 🎨 设计规范

### 品牌配色方案

| 颜色名称 | 颜色值 | 用途 | 示例 |
|---------|-------|------|-----|
| 朱砂深红 | `hsl(348 50% 30%)` | 主要按钮、重点强调 | 🔴 |
| 暗金色 | `hsl(40 42% 48%)` | 次要按钮、装饰元素 | 🟡 |
| 深色背景 | `hsl(28 18% 8%)` | Hero 区域、Footer | ⚫ |
| 浅色背景 | `hsl(40 18% 96%)` | 内容区域 | ⚪ |

### 页面区域样式

**深色区域（Hero、页脚）：**
```html
<section class="section-dark">
  <!-- 深色背景，金色/红色点缀 -->
</section>
```

**暖色区域（内容区）：**
```html
<section class="section-warm">
  <!-- 温暖的浅色背景 -->
</section>
```

### 动画效果

**进场动画（页面加载时）：**
- `animate-slide-up` - 从下往上滑入
- `animate-fade-in` - 淡入
- `animate-scale-in` - 缩放进入

**交互动画（用户操作时）：**
- `hover-lift` - 鼠标悬停时卡片上浮
- `hover:scale-105` - 鼠标悬停时图片放大
- `transition-all duration-300` - 平滑过渡效果

---

## 📂 文件目录结构（给开发者看的）

```
sishijian-site/
│
├── src/app/                          # 📄 页面文件
│   │
│   ├── (site)/[locale]/             # 多语言页面组
│   │   ├── page.tsx                 # 🏠 首页
│   │   ├── layout.tsx               # 布局（Header + Footer）
│   │   │
│   │   ├── services/
│   │   │   ├── page.tsx             # 服务总览
│   │   │   ├── brand-advertising/
│   │   │   │   └── page.tsx         # 品牌广告详情
│   │   │   └── culture-art/
│   │   │       └── page.tsx         # 文化艺术详情
│   │   │
│   │   ├── cases/
│   │   │   ├── page.tsx             # 案例列表（带筛选）
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # 单个案例详情（动态）
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx             # 关于我们
│   │   │
│   │   └── contact/
│   │       └── page.tsx             # 联系我们
│   │
│   └── globals.css                  # 🎨 全局样式（重要！）
│
├── src/components/                  # 🧩 可复用组件
│   ├── layout/
│   │   ├── Header.tsx               # 顶部导航栏
│   │   └── Footer.tsx               # 页脚
│   ├── leads/
│   │   ├── ConsultButton.tsx        # 咨询按钮
│   │   └── LeadCaptureDialog.tsx    # 咨询表单弹窗
│   ├── cases/
│   │   └── CasesExplorer.tsx        # 案例筛选器
│   ├── services/
│   │   └── ServicePageTemplate.tsx  # 服务页模板
│   └── ui/                          # 基础 UI 组件（按钮、卡片等）
│
├── src/lib/                         # 🔧 工具函数
│   ├── api.ts                       # ⭐ 统一数据接口（重要！）
│   ├── strapiApi.ts                 # Strapi 适配器
│   ├── payloadApi.ts                # Payload 适配器
│   └── i18n.ts                      # 语言配置
│
├── src/payload/                     # 📋 Payload CMS 数据结构定义
│   └── （保留作为 Strapi 参考模板）
│
├── .env                             # 🔐 环境配置（重要！）
├── package.json                     # 📦 项目依赖
├── next.config.js                   # ⚙️ Next.js 配置
│
├── HANDOVER.md                      # 📖 技术交接文档（中文）
└── SITE_MAP.md                      # 📍 本文件（网站地图）
```

---

## ✅ 页面验证状态

| 页面 | 状态 | 说明 |
|------|------|------|
| 首页（所有语言） | ✅ 正常 | Hero + 服务卡片 + 案例展示 + CTA |
| 服务总览 | ✅ 正常 | 2个服务卡片，可点击进入详情 |
| 品牌广告详情 | ✅ 正常 | 完整的服务说明、FAQ、CTA |
| 文化艺术详情 | ✅ 正常 | 完整的服务说明、FAQ、CTA |
| 案例列表 | ✅ 正常 | 带业务类型和行业筛选功能 |
| 案例详情 | ✅ 动态 | 取决于数据库中的案例数据 |
| 关于我们 | ✅ 正常 | 使命、愿景、双轮驱动模式 |
| 联系我们 | ✅ 正常 | 表单 + 联系信息 |

**所有核心页面已验证可访问，功能正常。**

---

## 🔍 快速测试方法

### 检查网站是否正常运行

**方法1：浏览器访问**
1. 确保开发服务器在运行（`npm run dev`）
2. 浏览器打开 http://localhost:3000
3. 应该能看到首页内容

**方法2：命令行检查**
```bash
# 检查首页是否返回 200（正常）
/usr/bin/curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/zh-HK
# 应该输出：200
```

### 检查所有页面状态
```bash
# 在项目目录运行
cd /Users/vince/Documents/sishijian-site

# 测试所有主要页面
for path in "" "/services" "/services/brand-advertising" "/services/culture-art" "/cases" "/about" "/contact"; do
  code=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/zh-HK${path}")
  echo "${code} → http://localhost:3000/zh-HK${path}"
done
```

**预期结果：** 所有页面都应该返回 `200`

---

## 💡 开发提示

### 如果要添加新页面

1. 在 `src/app/(site)/[locale]/` 下创建新文件夹
2. 添加 `page.tsx` 文件
3. 页面会自动支持多语言（通过 `[locale]` 参数）

### 如果要修改样式

- 全局样式：修改 `src/app/globals.css`
- 单个组件：在组件文件中使用 Tailwind 类名
- 记得使用品牌配色和预定义的动画类

### 如果要添加新的数据接口

1. 在 `src/lib/payloadApi.ts` 添加新的类型定义和函数
2. 在 `src/lib/strapiApi.ts` 添加对应的实现
3. 页面从 `src/lib/api.ts` 导入使用

---

## 📞 遇到问题？

**网站打不开：**
- 检查开发服务器是否在运行
- 端口 3000 是否被占用

**看不到数据：**
- 检查 `.env` 中的 `NEXT_PUBLIC_CMS_PROVIDER` 设置
- 确认对应的 CMS 后端正在运行
- 查看浏览器控制台是否有错误提示

**样式显示异常：**
- 检查 `globals.css` 是否被修改
- 清除浏览器缓存后重试
