# Yelinktrans Company Website

源译中英文企业官网正式版。项目采用 Nuxt 4、Nuxt Content、Vue、TypeScript 和静态站点生成，不包含数据库、后台管理系统或运行时服务器接口。

## 正式版本

- 上线包版本：V1.0
- 中文页面版本：V1.0
- 英文页面版本：V1.2
- 正式域名：`https://yelinktrans.com`
- 中文路由：`/`、`/services`、`/approach`、`/contact`、`/privacy`
- 英文路由：`/en`、`/en/services`、`/en/approach`、`/en/contact`、`/en/privacy`

## 技术架构

- Nuxt 4 + Vue 3 + TypeScript
- Nuxt Content：中文和英文内容文件
- Nuxt i18n：中英文路由和语言切换
- Nuxt Sitemap / Robots：站点地图和搜索引擎规则
- Nuxt Icon / Lucide：统一 SVG 图标
- `nuxt generate`：生成可直接部署的静态文件

## 环境要求

- Node.js 22 或更高的偶数版本
- pnpm（版本由 `packageManager` 字段固定）

## 本地运行

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

开发地址默认为 `http://localhost:3000`。

## 正式静态生成

```bash
corepack enable
pnpm install --frozen-lockfile
NUXT_PUBLIC_SITE_URL=https://yelinktrans.com pnpm typecheck
NUXT_PUBLIC_SITE_URL=https://yelinktrans.com pnpm generate
```

生成目录：`.output/public/`

正式部署时，只需要把 `.output/public/` 目录中的内容上传到静态网站根目录。完整操作见 `docs/DEPLOYMENT.md`。

## 内容维护位置

- 中文内容：`content/zh/`
- 英文内容：`content/en/`
- 公司信息、邮箱及导航：`app/config/site.ts`
- 页面组件：`app/pages/`、`app/components/`
- 全站样式：`app/assets/css/main.css`
- SEO和分享图规则：`app/composables/usePageSeo.ts`
- 网站图标和分享图：`public/`

修改内容后必须重新执行类型检查、静态生成和QA脚本，不能直接修改 `.output/public/` 中的生成文件。

## GitHub Pages 自动发布

项目已包含 `.github/workflows/deploy-pages.yml`。推送到 `main` 分支后会自动构建并发布到 GitHub Pages。

### 首次启用步骤

1. 在 GitHub 创建空仓库（例如 `yelinktrans-site`），不要勾选初始化 README。
2. 在本项目根目录执行：

```bash
git init -b main
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

3. 打开 GitHub 仓库 **Settings → Pages**：
   - **Source** 选择 **GitHub Actions**
4. 等待 Actions 工作流完成后，访问：
   - 项目站点：`https://<用户名>.github.io/<仓库名>/`
   - 用户站点（仓库名为 `<用户名>.github.io`）：`https://<用户名>.github.io/`

### 自定义域名（可选）

若使用 `yelinktrans.com` 作为 GitHub Pages 域名，在仓库 **Settings → Secrets and variables → Actions → Variables** 中设置：

- `NUXT_PUBLIC_SITE_URL` = `https://yelinktrans.com`
- `NUXT_APP_BASE_URL` = `/`

并在 **Settings → Pages → Custom domain** 填写 `yelinktrans.com`。DNS 需按 GitHub 文档添加相应记录，且不要影响 Microsoft 365 邮箱记录（见 `docs/DNS_MICROSOFT_365.md`）。

### 本地预览构建结果

```bash
pnpm generate
pnpm preview
```

## 发布前检查

```bash
pnpm typecheck
pnpm generate
pnpm qa:static
pnpm qa:english-responsive
```

部署、DNS和验收文档：

- `docs/DEPLOYMENT.md`
- `docs/DNS_MICROSOFT_365.md`
- `docs/LAUNCH_CHECKLIST.md`
- `docs/RELEASE_NOTES_V1.0.md`

## 第一版明确不包含

- 网站后台、数据库、登录和权限系统
- 在线留言表单、文件上传和在线支付
- 网站行为分析、广告追踪或营销 Cookie
- 阿拉伯文化风险审核方案

如后续增加上述能力，需要重新评估技术架构、隐私政策和安全要求。
