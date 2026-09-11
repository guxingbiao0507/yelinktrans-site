# 源译官网部署说明

## 1. 部署目标

- 正式域名：`https://yelinktrans.com`
- 网站类型：纯静态 Nuxt 网站
- 正式网站根目录：上线包中的 `01_可直接部署的静态网站/`
- 不需要：Node常驻进程、数据库、后台、对象存储、服务器API
- 联系方式：页面通过 `mailto:` 调用用户本地邮件客户端

## 2. 最快部署方式：直接上传静态文件

上线包已经包含完成构建的静态网站。将 `01_可直接部署的静态网站/` 目录**里面的全部文件和文件夹**上传至托管平台的网站根目录即可。

注意：网站根目录中应直接看到 `index.html`、`en/`、`services/`、`_nuxt/`、`robots.txt` 和 `sitemap.xml`，不要在服务器上多套一层目录。

托管平台需要支持：

1. 目录默认页为 `index.html`；
2. 自定义404页面指向 `/404.html`；
3. HTTPS证书；
4. 自定义域名；
5. 对没有扩展名的目录路径正常返回该目录下的 `index.html`。

## 3. 从源代码构建

适合Git自动部署或以后持续维护。

### 环境

- Node.js 22或更高的偶数版本；优先使用当前Active LTS版本；
- 启用Corepack；
- pnpm版本由项目 `packageManager` 字段固定。

### 命令

```bash
corepack enable
pnpm install --frozen-lockfile
NUXT_PUBLIC_SITE_URL=https://yelinktrans.com pnpm typecheck
NUXT_PUBLIC_SITE_URL=https://yelinktrans.com pnpm generate
```

构建产物位于：

```text
.output/public/
```

只部署该目录，不要把 `node_modules`、`.nuxt`、源内容文件或审核材料放到公网目录。

## 4. 常见平台配置

### 通用静态托管、OSS、COS或对象存储

- 上传目录：`01_可直接部署的静态网站/`中的全部内容；
- 默认首页：`index.html`；
- 404页面：`404.html`；
- 开启HTTPS；
- 设置 `yelinktrans.com` 为主域名；
- 将 `www.yelinktrans.com` 301跳转到 `https://yelinktrans.com`。

### Cloudflare Pages

如果从Git构建：

- Build command：`pnpm generate`
- Build output directory：`.output/public`
- Environment variable：`NUXT_PUBLIC_SITE_URL=https://yelinktrans.com`
- Node.js：22或更高的偶数版本

重要：Cloudflare Pages将根域名 `yelinktrans.com` 直接接入Pages时，通常需要把域名的权威DNS迁移到Cloudflare。当前域名承载Microsoft 365邮箱，迁移前必须完整复制全部邮箱DNS记录。若无法确认，不要迁移域名服务器。

### Vercel或其他支持Nuxt的平台

优先使用静态生成方式：

- Install command：`pnpm install --frozen-lockfile`
- Build command：`pnpm generate`
- Output directory：`.output/public`
- Environment variable：`NUXT_PUBLIC_SITE_URL=https://yelinktrans.com`

如果平台自动识别Nuxt并默认创建SSR或Serverless运行时，请明确改为静态输出；当前网站不需要服务器运行时。

### Nginx服务器

将静态文件复制到例如 `/var/www/yelinktrans/`，参考上线包中的 `04_服务器配置示例/nginx.conf.example`。启用配置前，需要将证书路径和服务器文件路径替换为实际值，并先运行 `nginx -t`。

## 5. 预发布要求

第一次部署不要立即修改正式域名。先使用平台提供的临时域名或测试子域名进行验收。

预发布站点必须至少满足一项：

- 使用访问密码；
- 仅允许指定IP访问；
- 返回 `X-Robots-Tag: noindex, nofollow`；
- 使用单独的禁止索引robots规则。

正式文件的robots规则允许搜索引擎抓取，因此不能把未保护的预发布地址长期公开。

## 6. 正式域名切换

1. 先完成 `docs/DNS_MICROSOFT_365.md` 中的DNS备份；
2. 根据托管平台要求，只新增或修改网站所需的A、AAAA、ALIAS、ANAME或CNAME记录；
3. 不删除或改动Microsoft 365的MX、SPF、DKIM、DMARC和Autodiscover记录；
4. 等待HTTPS证书生效；
5. 确认 `https://yelinktrans.com` 正常后，再配置 `www` 到主域名的301跳转；
6. 完成网页和邮箱双重验收后，才结束变更窗口。

## 7. 缓存建议

- `/_nuxt/*`：`Cache-Control: public, max-age=31536000, immutable`
- HTML：`Cache-Control: public, max-age=0, must-revalidate`
- PNG、SVG：可缓存7至30天
- `robots.txt`、`sitemap.xml`：建议1小时内重新验证

项目已包含适用于Cloudflare Pages等平台的 `public/_headers`。其他平台可在控制台或Web服务器中配置同等规则。

## 8. 回滚

DNS切换前保留：

- 旧DNS记录导出文件；
- 上一个可用网站版本；
- 当前上线包压缩文件；
- 原托管平台配置和证书信息。

如果出现严重问题，优先恢复原网站指向，不要在生产环境临时修改大量源码。

## 9. 官方技术参考

- Nuxt部署：<https://nuxt.com/docs/4.x/getting-started/deployment>
- Nuxt预渲染：<https://nuxt.com/docs/4.x/getting-started/prerendering>
- Nuxt Content静态托管：<https://content.nuxt.com/docs/deploy/static>
- Cloudflare Pages自定义域名：<https://developers.cloudflare.com/pages/configuration/custom-domains/>
- Vercel自定义域名：<https://vercel.com/docs/domains/set-up-custom-domain>
