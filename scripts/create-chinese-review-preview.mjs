import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, '.output', 'public')
const outputDir = join(root, 'deliverables')
const outputFile = join(outputDir, '源译官网_中文版_第二阶段审核预览_V0.5.html')

const pages = [
  { path: '/', file: 'index.html', template: 'review-home', title: '无锡源译｜AI驱动的多语言内容服务、数据与解决方案' },
  { path: '/services', file: 'services/index.html', template: 'review-services', title: '服务与经验｜多语言内容、数据与AI解决方案｜无锡源译' },
  { path: '/approach', file: 'approach/index.html', template: 'review-approach', title: '协作方式｜从问题出发，让方案真正落地｜无锡源译' },
  { path: '/contact', file: 'contact/index.html', template: 'review-contact', title: '联系合作｜无锡源译' },
  { path: '/privacy', file: 'privacy/index.html', template: 'review-privacy', title: '隐私政策｜无锡源译' }
]

function extractSiteShell(html, file) {
  const start = html.indexOf('<div class="site-shell">')
  const footerEnd = html.indexOf('</footer>', start)
  const shellEnd = html.indexOf('</div>', footerEnd)

  if (start < 0 || footerEnd < 0 || shellEnd < 0) {
    throw new Error(`无法从 ${file} 提取页面主体。`)
  }

  return html.slice(start, shellEnd + '</div>'.length)
}

const homeHtml = await readFile(join(publicDir, 'index.html'), 'utf8')
const stylesheetMatch = homeHtml.match(/<link rel="stylesheet" href="([^"]+)"[^>]*>/)

if (!stylesheetMatch) {
  throw new Error('未找到站点主样式文件，请先运行 pnpm generate。')
}

const css = await readFile(join(publicDir, stylesheetMatch[1].replace(/^\//, '')), 'utf8')
const templates = []

for (const page of pages) {
  const html = await readFile(join(publicDir, page.file), 'utf8')
  templates.push(`<template id="${page.template}">${extractSiteShell(html, page.file)}</template>`)
}

const pageMap = Object.fromEntries(pages.map(page => [page.path, { template: page.template, title: page.title }]))

const reviewHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${pages[0].title}</title>
  <style>${css}</style>
</head>
<body>
  <div id="review-app"></div>
  ${templates.join('\n  ')}
  <script>
    (() => {
      const pages = ${JSON.stringify(pageMap)};
      const app = document.getElementById('review-app');

      function parseReviewLocation() {
        const value = location.hash.startsWith('#/') ? location.hash.slice(1) : '/';
        const [rawPath, query = ''] = value.split('?');
        const path = pages[rawPath] ? rawPath : '/';
        const anchor = new URLSearchParams(query).get('anchor') || '';
        return { path, anchor };
      }

      function reviewHash(path, anchor = '') {
        return '#' + path + (anchor ? '?anchor=' + encodeURIComponent(anchor) : '');
      }

      function navigate(path, anchor = '') {
        const next = reviewHash(path, anchor);
        if (location.hash === next) render();
        else location.hash = next;
      }

      function routeFromHref(href) {
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) return null;

        if (href.startsWith('#')) {
          return { path: parseReviewLocation().path, anchor: href.slice(1) };
        }

        const url = new URL(href, 'https://review.local');
        if (!pages[url.pathname]) return null;
        return { path: url.pathname, anchor: url.hash.slice(1) };
      }

      function bindNavigation() {
        const toggle = app.querySelector('.menu-toggle');
        const nav = app.querySelector('.primary-nav');
        const closeMenu = () => {
          nav?.classList.remove('is-open');
          toggle?.setAttribute('aria-expanded', 'false');
          toggle?.setAttribute('aria-label', '打开菜单');
        };

        toggle?.addEventListener('click', () => {
          const isOpen = nav?.classList.toggle('is-open') ?? false;
          toggle.setAttribute('aria-expanded', String(isOpen));
          toggle.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
        });

        app.querySelectorAll('a[href]').forEach((link) => {
          link.addEventListener('click', (event) => {
            const target = routeFromHref(link.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            closeMenu();
            navigate(target.path, target.anchor);
          });
        });
      }

      function render() {
        const { path, anchor } = parseReviewLocation();
        const page = pages[path];
        const template = document.getElementById(page.template);
        app.replaceChildren(template.content.cloneNode(true));
        document.title = page.title + '｜中文审核版 V0.5';
        bindNavigation();

        requestAnimationFrame(() => {
          if (anchor) {
            const target = document.getElementById(anchor);
            target?.scrollIntoView({ block: 'start' });
          } else {
            window.scrollTo({ top: 0, left: 0 });
          }
        });
      }

      window.addEventListener('hashchange', render);
      if (!location.hash.startsWith('#/')) location.replace(reviewHash('/'));
      else render();
    })();
  </script>
</body>
</html>`

await mkdir(outputDir, { recursive: true })
await writeFile(outputFile, reviewHtml)
console.log(outputFile)
