import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const publicDir = process.env.STATIC_OUTPUT_DIR
  ? pathToFileURL(path.resolve(process.env.STATIC_OUTPUT_DIR) + path.sep)
  : new URL('../.output/public/', import.meta.url)
const reportDir = new URL('../qa-v07-bilingual/', import.meta.url)
const routes = [
  { path: '/', file: 'index.html', locale: 'zh', lang: 'zh-CN', title: '无锡源译｜AI驱动的多语言内容服务、数据与解决方案' },
  { path: '/services', file: 'services/index.html', locale: 'zh', lang: 'zh-CN', title: '服务与经验｜多语言内容、数据与AI解决方案｜无锡源译' },
  { path: '/approach', file: 'approach/index.html', locale: 'zh', lang: 'zh-CN', title: '协作方式｜从问题出发，让方案真正落地｜无锡源译' },
  { path: '/contact', file: 'contact/index.html', locale: 'zh', lang: 'zh-CN', title: '联系合作｜无锡源译' },
  { path: '/privacy', file: 'privacy/index.html', locale: 'zh', lang: 'zh-CN', title: '隐私政策｜无锡源译' },
  { path: '/en', file: 'en/index.html', locale: 'en', lang: 'en-US', title: 'Yelinktrans | AI-Powered Multilingual Content, Data & Solutions' },
  { path: '/en/services', file: 'en/services/index.html', locale: 'en', lang: 'en-US', title: 'Services & Expertise | Multilingual Content, Data and AI Solutions | Yelinktrans' },
  { path: '/en/approach', file: 'en/approach/index.html', locale: 'en', lang: 'en-US', title: 'How We Work | From Real Problems to Practical Solutions | Yelinktrans' },
  { path: '/en/contact', file: 'en/contact/index.html', locale: 'en', lang: 'en-US', title: 'Contact Us | Yelinktrans' },
  { path: '/en/privacy', file: 'en/privacy/index.html', locale: 'en', lang: 'en-US', title: 'Privacy Policy | Yelinktrans' }
]

const forbiddenPublicText = [
  '首版暂不使用营销 Cookie 或在线留言表单',
  '天鹅座C座',
  '阿拉伯文化风险',
  'AI解决方案及实施',
  '多语言内容测试和审核',
  '质量门槛',
  '以下案例均为匿名展示的核心团队历史经验',
  'SERVICE BOUNDARIES',
  '提前说明边界，让合作预期更清晰',
  '待核验',
  '正式上线时填写',
  '英文版将在中文版确认后制作',
  'English version coming soon'
]

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

function mainHtml(html) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
  return match?.[1] ?? ''
}

function ids(html) {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]))
}

function internalLinks(html) {
  return [...html.matchAll(/<a\b[^>]*\shref="([^"]+)"[^>]*>/gi)].map(match => decodeHtml(match[1]))
}

const htmlByRoute = new Map()
for (const route of routes) {
  htmlByRoute.set(route.path, await readFile(new URL(route.file, publicDir), 'utf8'))
}

const requiredPublicAssets = [
  'favicon.svg',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'og-image.png',
  'og-image-en.png',
  '_headers'
]
const publicAssetChecks = {}
for (const asset of requiredPublicAssets) {
  try {
    await readFile(new URL(asset, publicDir))
    publicAssetChecks[asset] = true
  } catch {
    publicAssetChecks[asset] = false
  }
}

const pageChecks = []
const failures = []

for (const route of routes) {
  const html = htmlByRoute.get(route.path)
  const main = mainHtml(html)
  const h1Count = (main.match(/<h1\b/gi) ?? []).length
  const title = decodeHtml(html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '')
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? ''
  const htmlLang = html.match(/<html\s+lang="([^"]+)"/i)?.[1] ?? ''
  const forbidden = forbiddenPublicText.filter(text => html.includes(text))
  const brokenLinks = []

  for (const href of internalLinks(html)) {
    if (/^(mailto:|tel:|https?:\/\/)/i.test(href)) continue

    if (href.startsWith('#')) {
      if (!ids(html).has(href.slice(1))) brokenLinks.push(href)
      continue
    }

    const target = new URL(href, 'https://yelinktrans.com')
    const targetHtml = htmlByRoute.get(target.pathname)
    if (!targetHtml) {
      brokenLinks.push(href)
      continue
    }
    if (target.hash && !ids(targetHtml).has(target.hash.slice(1))) brokenLinks.push(href)
  }

  const check = {
    route: route.path,
    title,
    titleMatches: title === route.title,
    h1Count,
    htmlLang,
    languageMatches: htmlLang === route.lang,
    canonical,
    hasDescription: /<meta name="description" content="[^"]+"/i.test(html),
    hasZhAlternate: /hreflang="zh-CN"/i.test(html),
    hasEnAlternate: /hreflang="en"/i.test(html),
    forbidden,
    brokenLinks,
    hasRuntimeHomeApi: html.includes('/api/home')
  }
  pageChecks.push(check)

  if (!check.titleMatches) failures.push(`${route.path}: title mismatch`)
  if (check.h1Count !== 1) failures.push(`${route.path}: H1 count is ${check.h1Count}`)
  if (!check.languageMatches) failures.push(`${route.path}: html lang is ${check.htmlLang}`)
  if (!check.canonical) failures.push(`${route.path}: canonical missing`)
  if (!check.hasDescription) failures.push(`${route.path}: description missing`)
  if (!check.hasZhAlternate || !check.hasEnAlternate) failures.push(`${route.path}: hreflang incomplete`)
  if (check.forbidden.length) failures.push(`${route.path}: forbidden text ${check.forbidden.join(', ')}`)
  if (check.brokenLinks.length) failures.push(`${route.path}: broken links ${check.brokenLinks.join(', ')}`)
  if (check.hasRuntimeHomeApi) failures.push(`${route.path}: runtime home API remains`)
}

const zhHome = htmlByRoute.get('/')
const zhServices = htmlByRoute.get('/services')
const enHome = htmlByRoute.get('/en')
const enServices = htmlByRoute.get('/en/services')
const allZh = routes.filter(route => route.locale === 'zh').map(route => htmlByRoute.get(route.path)).join('\n')
const allEn = routes.filter(route => route.locale === 'en').map(route => htmlByRoute.get(route.path)).join('\n')

const reviewFiles = [
  new URL('../deliverables/源译官网_中文版_定稿_V1.0.html', import.meta.url),
  new URL('../deliverables/源译官网_英文版_定稿_V1.2.html', import.meta.url)
]
const reviewChecks = []

for (const file of reviewFiles) {
  try {
    const html = await readFile(file, 'utf8')
    reviewChecks.push({
      file: decodeURIComponent(file.pathname.split('/').pop()),
      exists: true,
      templateCount: (html.match(/<template id="review-/g) ?? []).length,
      siteShellCount: (html.match(/class="site-shell/g) ?? []).length,
      externalAssets: /<link[^>]+href=|<script[^>]+src=|\/_nuxt\//.test(html)
    })
  } catch {
    reviewChecks.push({ file: file.pathname, exists: false })
  }
}

const globalChecks = {
  routeCount: routes.length,
  chineseServiceNamesUpdated: allZh.includes('AI解决方案与实施') && allZh.includes('多语言内容测试与审核'),
  englishServiceNamesPresent: allEn.includes('AI Solution Design &amp; Implementation') && allEn.includes('Multilingual Content Testing &amp; Review'),
  approvedEnglishCopyPresent: [
    'Services &amp; Expertise',
    'How We Work',
    'About Us',
    'Expertise That Translates',
    'Value That Travels',
    'Industry Insight. Solutions Built for Global Growth.',
    'Different Industries. The Right Delivery Model for Each.',
    'Practical Solutions, Shaped by Experience.',
    'Define the Problem Before Designing the Solution.',
    'Where This Approach Adds the Most Value.',
    'Start with the Need.',
    'Shape the Right Service Plan.'
  ].every(value => allEn.includes(value)),
  retiredEnglishCopyAbsent: [
    'Services &amp; Experience',
    'Powered by Expertise',
    'Value Across Languages',
    'service mix',
    'industry difference',
    'AI Solutions and Implementation'
  ].every(value => !allEn.includes(value)),
  englishNoWrapPhrasesRendered: enHome.includes('<span class="no-wrap-phrase">testing methods and AI solutions</span>')
    && enServices.includes('<span class="section-description-line">Quality expectations and the right level of human oversight vary by content and business stage.</span>')
    && enServices.includes('<span class="no-wrap-phrase">testing methods and AI solutions</span>'),
  claimsAligned: ['180+', '20,000+', '16'].every(value => zhHome.includes(value) && enHome.includes(value)),
  caseCountZh: (zhServices.match(/class="case-card"/g) ?? []).length,
  caseCountEn: (enServices.match(/class="case-card"/g) ?? []).length,
  attributionZh: zhServices.includes('核心团队历史经验'),
  attributionEn: enServices.includes('Core Team Historical Experience'),
  zhLanguageSwitch: /class="language-link"[^>]*>EN<\/a>/.test(zhHome),
  enLanguageSwitch: /class="language-link"[^>]*>中文<\/a>/.test(enHome),
  socialImagesLocalized: allZh.includes('https://yelinktrans.com/og-image.png')
    && allEn.includes('https://yelinktrans.com/og-image-en.png')
    && !allEn.includes('https://yelinktrans.com/og-image.png'),
  publicAssetChecks,
  reviewChecks
}

if (!globalChecks.chineseServiceNamesUpdated) failures.push('Updated Chinese service names are incomplete')
if (!globalChecks.englishServiceNamesPresent) failures.push('English service names are incomplete')
if (!globalChecks.approvedEnglishCopyPresent) failures.push('Approved English copy is incomplete')
if (!globalChecks.retiredEnglishCopyAbsent) failures.push('Retired English copy remains')
if (!globalChecks.englishNoWrapPhrasesRendered) failures.push('English no-wrap phrase markup is incomplete')
if (!globalChecks.claimsAligned) failures.push('Chinese and English headline claims are not aligned')
if (globalChecks.caseCountZh !== 5 || globalChecks.caseCountEn !== 5) failures.push('Chinese or English case count is not 5')
if (!globalChecks.attributionZh || !globalChecks.attributionEn) failures.push('Historical-experience attribution is incomplete')
if (!globalChecks.zhLanguageSwitch || !globalChecks.enLanguageSwitch) failures.push('Language switcher is incomplete')
if (!globalChecks.socialImagesLocalized) failures.push('Localized social sharing images are incomplete')
for (const [asset, exists] of Object.entries(publicAssetChecks)) {
  if (!exists) failures.push(`Required public asset missing: ${asset}`)
}

for (const check of reviewChecks) {
  if (!check.exists) failures.push(`${check.file}: review file missing`)
  else if (check.templateCount !== 5 || check.siteShellCount !== 5 || check.externalAssets) {
    failures.push(`${check.file}: standalone review structure invalid`)
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  passed: failures.length === 0,
  pageChecks,
  globalChecks,
  failures
}

await mkdir(reportDir, { recursive: true })
await writeFile(new URL('static-report.json', reportDir), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
if (failures.length) process.exitCode = 1
