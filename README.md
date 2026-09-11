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
   - **Custom domain** 填写 `yelinktrans.com` 并启用 **Enforce HTTPS**
4. 在 DNS 服务商为 `yelinktrans.com` 添加 GitHub Pages 要求的解析记录，且不要影响 Microsoft 365 邮箱记录（见 `docs/DNS_MICROSOFT_365.md`）。
5. 等待 Actions 工作流完成后，正式访问地址为 `https://yelinktrans.com`。

默认构建配置：

- `NUXT_PUBLIC_SITE_URL` = `https://yelinktrans.com`
- `NUXT_APP_BASE_URL` = `/`

如需临时改回 GitHub 预览地址，可在仓库 **Settings → Secrets and variables → Actions → Variables** 中覆盖上述变量，例如：

- `NUXT_PUBLIC_SITE_URL` = `https://<用户名>.github.io`
- `NUXT_APP_BASE_URL` = `/<仓库名>/`

### 迁移到 yelinktrans 组织

若希望 GitHub 预览地址从 `https://guxingbiao0507.github.io/yelinktrans-site/` 变为 `https://yelinktrans.github.io/yelinktrans-site/`，需要把仓库转移到名为 `yelinktrans` 的 GitHub 用户或组织下。预览地址格式为 `https://<所有者>.github.io/<仓库名>/`，无法在代码里单独修改 `<所有者>` 部分。

#### 前置条件

1. 已创建 GitHub 组织（或用户）`yelinktrans`，且你拥有管理员权限。
2. 组织名称未被他人占用；若不可用，只能更换组织名，预览域名会随之改变。
3. 迁移前确认当前 Actions 最近一次部署成功，避免带着未修复问题迁移。

#### 迁移步骤

**1. 在 GitHub 转移仓库**

打开原仓库 **Settings → General → Danger Zone → Transfer ownership**，将 `guxingbiao0507/yelinktrans-site` 转移到 `yelinktrans` 组织。

转移后仓库地址变为：

`https://github.com/yelinktrans/yelinktrans-site`

**2. 更新本地 git remote**

```bash
git remote set-url origin git@github.com:yelinktrans/yelinktrans-site.git
git remote -v
git push -u origin main
```

**3. 在新仓库重新启用 GitHub Pages**

打开 `https://github.com/yelinktrans/yelinktrans-site/settings/pages`：

- **Source** 选择 **GitHub Actions**
- **Custom domain** 填写 `yelinktrans.com`（若继续使用正式域名）
- DNS 生效后启用 **Enforce HTTPS**

迁移后 Custom domain 和 DNS 不会自动继承，需在新仓库里重新保存一次域名设置。

**4. 检查 Actions 与 DNS**

- 在 **Actions** 页确认 `Deploy to GitHub Pages` 工作流运行成功。
- 若使用 `yelinktrans.com`，按 `docs/DNS_MICROSOFT_365.md` 核对解析记录，确保未影响 Microsoft 365 邮箱。

**5. 验证访问地址**

| 用途 | 地址 |
|------|------|
| GitHub 预览（项目站点） | `https://yelinktrans.github.io/yelinktrans-site/` |
| 正式域名 | `https://yelinktrans.com` |

默认构建仍指向正式域名 `https://yelinktrans.com`，与 GitHub 预览地址可以并存。正式域名生效前，可临时在 Actions Variables 中设置：

- `NUXT_PUBLIC_SITE_URL` = `https://yelinktrans.github.io`
- `NUXT_APP_BASE_URL` = `/yelinktrans-site/`

#### 使用 `https://yelinktrans.github.io`（无 `/yelinktrans-site/` 后缀）

**可以。** GitHub 组织站点的根域名规则是：仓库必须命名为 `yelinktrans.github.io`，且位于 `yelinktrans` 组织下。

当前仓库名为 `yelinktrans-site`，因此预览地址只能是 `https://yelinktrans.github.io/yelinktrans-site/`。

若希望直接使用 `https://yelinktrans.github.io`：

1. 在 GitHub 将仓库 **Rename** 为 `yelinktrans.github.io`；
2. 更新本地 remote：

```bash
git remote set-url origin git@github.com:yelinktrans/yelinktrans.github.io.git
```

3. 仓库改名后，GitHub Pages 会自动发布到组织根路径；本项目默认构建已是 `NUXT_APP_BASE_URL=/`，通常无需再改变量；
4. 若暂时只用 GitHub 预览、尚未绑定 `yelinktrans.com`，可在 Actions Variables 中设置 `NUXT_PUBLIC_SITE_URL=https://yelinktrans.github.io`；
5. 若同时保留正式域名 `yelinktrans.com`，继续在新仓库 Pages 设置中填写 Custom domain 即可，两个地址可并存。

改名会影响现有链接和协作者书签，执行前请同步团队。

#### 迁移后常见问题

- **构建报错 `Dependencies lock file is not found` / 找不到 `package-lock.json`**：说明仓库里存在 GitHub 自动生成的 Nuxt 工作流（如 `nuxtjs.yml`），它误用 npm 而非 pnpm。删除多余 workflow，仅保留 `.github/workflows/deploy-pages.yml`，并在 Pages 设置中将 Source 选为 **GitHub Actions**。
- **预览地址 404**：确认 Pages Source 为 GitHub Actions，且最近一次 workflow 成功。
- **样式或资源加载失败**：通常是 `NUXT_APP_BASE_URL` 与实际访问路径不一致，按上表核对 Variables。
- **正式域名未生效**：在新仓库 Pages 设置中重新填写 `yelinktrans.com`，并检查 DNS 是否仍指向 GitHub Pages。
- **邮箱异常**：优先按 `docs/DNS_MICROSOFT_365.md` 回滚 DNS，不要为网站上线牺牲邮箱服务。

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
