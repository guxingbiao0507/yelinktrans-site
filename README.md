# Yelinktrans Company Website

源译中英文企业官网正式版。项目采用 Nuxt 4、Nuxt Content、Vue、TypeScript 和静态站点生成，不包含数据库、后台管理系统或运行时服务器接口。

## 在线地址

| 用途 | 地址 |
|------|------|
| 正式域名 | https://yelinktrans.com |
| GitHub Pages 预览 | https://yelinktrans.github.io |
| 代码仓库 | https://github.com/yelinktrans/yelinktrans.github.io |

## 正式版本

- 上线包版本：V1.0
- 中文页面版本：V1.0
- 英文页面版本：V1.2
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

本地预览构建结果：

```bash
pnpm generate
pnpm preview
```

正式部署时，只需要把 `.output/public/` 目录中的内容上传到静态网站根目录。完整操作见 `docs/DEPLOYMENT.md`。

### Windows 打包（Nginx / 静态托管）

在 **PowerShell** 中于项目根目录执行：

```powershell
corepack enable
pnpm install --frozen-lockfile

$env:NUXT_PUBLIC_SITE_URL = 'https://yelinktrans.com'
pnpm typecheck
pnpm generate
pnpm qa:static
pnpm qa:english-responsive
```

构建产物默认位于 `.output/public/`。为方便上传到 Nginx 服务器，可复制到 `dist/`：

```powershell
if (Test-Path dist) { Remove-Item -Recurse -Force dist }
robocopy .output\public dist /E
```

打包为 zip 以便传输：

```powershell
$stamp = Get-Date -Format 'yyyyMMdd-HHmm'
Compress-Archive -Path dist\* -DestinationPath "yelinktrans-site-$stamp.zip" -Force
```

部署到 Nginx 时，上传 `dist/`（或 `.output/public/`）**里面的全部文件**到网站根目录，例如 `C:\inetpub\yelinktrans\` 或 Linux 上的 `/var/www/yelinktrans/`。根目录下应直接看到 `index.html`、`_nuxt/`、`en/`，不要多套一层文件夹。

说明：

- 纯 Nginx 部署可忽略 `dist/CNAME`（该文件仅用于 GitHub Pages 自定义域名）。
- 若 `pnpm generate` 报 `.output` 目录被占用，先关闭正在运行的 `pnpm preview` 或 `pnpm dev`，再重试。
- Windows 与 Linux 使用相同环境变量；正式域名固定为 `https://yelinktrans.com` 时无需设置 `NUXT_APP_BASE_URL`（默认为 `/`）。

## 内容维护位置

- 中文内容：`content/zh/`
- 英文内容：`content/en/`
- 公司信息、邮箱及导航：`app/config/site.ts`
- 页面组件：`app/pages/`、`app/components/`
- 全站样式：`app/assets/css/main.css`
- SEO 和分享图规则：`app/composables/usePageSeo.ts`
- 网站图标和分享图：`public/`

修改内容后必须重新执行类型检查、静态生成和 QA 脚本，不能直接修改 `.output/public/` 中的生成文件。

## 日常发布流程

1. 修改 `content/`、`app/` 或 `public/` 中的源文件
2. 本地检查：

```bash
pnpm typecheck
pnpm generate
pnpm qa:static
pnpm qa:english-responsive
```

3. 提交并推送到 `main` 分支
4. GitHub Actions 自动构建并发布到 GitHub Pages
5. 验证 https://yelinktrans.github.io 与 https://yelinktrans.com

## GitHub Pages 自动发布

项目使用 `.github/workflows/deploy-pages.yml`。推送到 `main` 分支后，会自动执行 `pnpm generate` 并将 `.output/public/` 部署到 GitHub Pages。

### 仓库与 Pages 设置

- 仓库：`yelinktrans/yelinktrans.github.io`
- Pages Source：**GitHub Actions**
- Custom domain：`yelinktrans.com`（DNS 生效后启用 **Enforce HTTPS**）
- 自定义域名文件：`public/CNAME`

### 默认构建变量

工作流默认使用根路径部署，无需子目录前缀：

- `NUXT_PUBLIC_SITE_URL` = `https://yelinktrans.com`
- `NUXT_APP_BASE_URL` = `/`

如需覆盖，可在仓库 **Settings → Secrets and variables → Actions → Variables** 中设置同名变量。例如仅使用 GitHub 预览时：

- `NUXT_PUBLIC_SITE_URL` = `https://yelinktrans.github.io`
- `NUXT_APP_BASE_URL` = `/`

### 克隆与推送

```bash
git clone git@github.com:yelinktrans/yelinktrans.github.io.git
cd yelinktrans.github.io
pnpm install --frozen-lockfile
pnpm dev
```

```bash
git add -A
git commit -m "Update site content"
git push origin main
```

### 常见问题

- **构建报错 `Dependencies lock file is not found`**：通常是 GitHub 自动生成的 `nuxtjs.yml` 误用 npm。删除多余 workflow，仅保留 `deploy-pages.yml`。
- **页面 404 或样式丢失**：检查 Pages Source 是否为 GitHub Actions，并确认 `NUXT_APP_BASE_URL` 与实际访问路径一致。
- **正式域名未生效**：在 Pages 设置中重新保存 `yelinktrans.com`，并按 `docs/DNS_MICROSOFT_365.md` 核对 DNS，确保未影响 Microsoft 365 邮箱。

## 相关文档

- `docs/DEPLOYMENT.md`：部署说明
- `docs/DNS_MICROSOFT_365.md`：域名与邮箱 DNS 保护
- `docs/LAUNCH_CHECKLIST.md`：上线验收清单
- `docs/RELEASE_NOTES_V1.0.md`：V1.0 发布说明

## 第一版明确不包含

- 网站后台、数据库、登录和权限系统
- 在线留言表单、文件上传和在线支付
- 网站行为分析、广告追踪或营销 Cookie
- 阿拉伯文化风险审核方案

如后续增加上述能力，需要重新评估技术架构、隐私政策和安全要求。
