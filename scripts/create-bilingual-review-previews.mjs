import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, '.output', 'public')
const outputDir = join(root, 'deliverables')

const pageDefinitions = [
  {
    path: '/',
    file: 'index.html',
    template: 'review-home',
    zhTitle: '无锡源译｜AI驱动的多语言内容服务、数据与解决方案',
    enTitle: 'Yelinktrans | AI-Powered Multilingual Content, Data & Solutions'
  },
  {
    path: '/services',
    file: 'services/index.html',
    template: 'review-services',
    zhTitle: '服务与经验｜多语言内容、数据与AI解决方案｜无锡源译',
    enTitle: 'Services & Expertise | Multilingual Content, Data and AI Solutions | Yelinktrans'
  },
  {
    path: '/approach',
    file: 'approach/index.html',
    template: 'review-approach',
    zhTitle: '协作方式｜从问题出发，让方案真正落地｜无锡源译',
    enTitle: 'How We Work | From Real Problems to Practical Solutions | Yelinktrans'
  },
  {
    path: '/contact',
    file: 'contact/index.html',
    template: 'review-contact',
    zhTitle: '联系合作｜无锡源译',
    enTitle: 'Contact Us | Yelinktrans'
  },
  {
    path: '/privacy',
    file: 'privacy/index.html',
    template: 'review-privacy',
    zhTitle: '隐私政策｜无锡源译',
    enTitle: 'Privacy Policy | Yelinktrans'
  }
]

const editions = [
  {
    locale: 'zh',
    lang: 'zh-CN',
    sourcePrefix: '',
    outputFile: '源译官网_中文版_定稿_V1.0.html',
    partnerFile: '源译官网_英文版_定稿_V1.2.html',
    titleKey: 'zhTitle',
    titleSuffix: '｜中文定稿 V1.0',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单'
  },
  {
    locale: 'en',
    lang: 'en-US',
    sourcePrefix: 'en/',
    outputFile: '源译官网_英文版_定稿_V1.2.html',
    partnerFile: '源译官网_中文版_定稿_V1.0.html',
    titleKey: 'enTitle',
    titleSuffix: ' | English Final V1.2',
    openMenu: 'Open menu',
    closeMenu: 'Close menu'
  }
]

const localeArgument = process.argv.find(argument => argument.startsWith('--locale='))?.split('=')[1]
if (localeArgument && !editions.some(edition => edition.locale === localeArgument)) {
  throw new Error(`Unsupported locale: ${localeArgument}`)
}
const selectedEditions = localeArgument
  ? editions.filter(edition => edition.locale === localeArgument)
  : editions

function extractSiteShell(html, file) {
  const start = html.indexOf('<div class="site-shell')
  const footerEnd = html.indexOf('</footer>', start)
  const shellEnd = html.indexOf('</div>', footerEnd)

  if (start < 0 || footerEnd < 0 || shellEnd < 0) {
    throw new Error(`Unable to extract the site shell from ${file}.`)
  }

  return html.slice(start, shellEnd + '</div>'.length)
}

const homeHtml = await readFile(join(publicDir, 'index.html'), 'utf8')
const stylesheetMatch = homeHtml.match(/<link rel="stylesheet" href="([^"]+)"[^>]*>/)

if (!stylesheetMatch) {
  throw new Error('Main stylesheet not found. Run nuxt generate first.')
}

const css = await readFile(join(publicDir, stylesheetMatch[1].replace(/^\//, '')), 'utf8')
await mkdir(outputDir, { recursive: true })

for (const edition of selectedEditions) {
  const templates = []

  for (const page of pageDefinitions) {
    const sourceFile = join(publicDir, edition.sourcePrefix, page.file)
    const html = await readFile(sourceFile, 'utf8')
    templates.push(`<template id="${page.template}">${extractSiteShell(html, sourceFile)}</template>`)
  }

  const pageMap = Object.fromEntries(pageDefinitions.map(page => [
    page.path,
    { template: page.template, title: page[edition.titleKey] }
  ]))

  const reviewHtml = `<!doctype html>
<html lang="${edition.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${pageDefinitions[0][edition.titleKey]}</title>
  <style>${css}</style>
</head>
<body>
  <div id="review-app"></div>
  ${templates.join('\n  ')}
  <script>
    (() => {
      const pages = ${JSON.stringify(pageMap)};
      const sourceLocale = ${JSON.stringify(edition.locale)};
      const partnerFile = ${JSON.stringify(edition.partnerFile)};
      const titleSuffix = ${JSON.stringify(edition.titleSuffix)};
      const openMenuLabel = ${JSON.stringify(edition.openMenu)};
      const closeMenuLabel = ${JSON.stringify(edition.closeMenu)};
      const app = document.getElementById('review-app');

      function normalizePath(path) {
        const withoutLocale = path.replace(/^\\/en(?=\\/|$)/, '') || '/';
        return pages[withoutLocale] ? withoutLocale : '/';
      }

      function parseReviewLocation() {
        const value = location.hash.startsWith('#/') ? location.hash.slice(1) : '/';
        const [rawPath, query = ''] = value.split('?');
        const path = normalizePath(rawPath);
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
        const path = normalizePath(url.pathname);
        return { path, anchor: url.hash.slice(1) };
      }

      function bindNavigation() {
        const toggle = app.querySelector('.menu-toggle');
        const nav = app.querySelector('.primary-nav');
        const closeMenu = () => {
          nav?.classList.remove('is-open');
          toggle?.setAttribute('aria-expanded', 'false');
          toggle?.setAttribute('aria-label', openMenuLabel);
        };

        toggle?.addEventListener('click', () => {
          const isOpen = nav?.classList.toggle('is-open') ?? false;
          toggle.setAttribute('aria-expanded', String(isOpen));
          toggle.setAttribute('aria-label', isOpen ? closeMenuLabel : openMenuLabel);
        });

        app.querySelectorAll('a[href]').forEach((link) => {
          link.addEventListener('click', (event) => {
            const target = routeFromHref(link.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            closeMenu();

            if (link.classList.contains('language-link')) {
              location.href = partnerFile + reviewHash(target.path, target.anchor);
              return;
            }

            navigate(target.path, target.anchor);
          });
        });
      }

      function render() {
        const { path, anchor } = parseReviewLocation();
        const page = pages[path];
        const template = document.getElementById(page.template);
        app.replaceChildren(template.content.cloneNode(true));
        document.title = page.title + titleSuffix;
        document.documentElement.lang = sourceLocale === 'en' ? 'en-US' : 'zh-CN';
        bindNavigation();

        requestAnimationFrame(() => {
          if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ block: 'start' });
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

  const outputFile = join(outputDir, edition.outputFile)
  await writeFile(outputFile, reviewHtml)
  console.log(outputFile)
}
