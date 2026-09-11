import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
const publicDir = new URL('../.output/public/', import.meta.url)
const reportDir = new URL('../qa-v05-zh/', import.meta.url)
const routes = [
  { path: '/', file: 'index.html', title: '无锡源译｜AI驱动的多语言内容服务、数据与解决方案' },
  { path: '/services', file: 'services/index.html', title: '服务与经验｜多语言内容、数据与AI解决方案｜无锡源译' },
  { path: '/approach', file: 'approach/index.html', title: '协作方式｜从问题出发，让方案真正落地｜无锡源译' },
  { path: '/contact', file: 'contact/index.html', title: '联系合作｜无锡源译' },
  { path: '/privacy', file: 'privacy/index.html', title: '隐私政策｜无锡源译' }
]
const forbiddenPublicText = [
  '首版暂不使用营销 Cookie 或在线留言表单',
  '天鹅座C座',
  '阿拉伯文化风险',
  '质量门槛',
  '以下案例均为匿名展示的核心团队历史经验',
  'SERVICE BOUNDARIES',
  '提前说明边界，让合作预期更清晰',
  '待核验',
  '正式上线时填写'
]

const htmlByRoute = new Map()
for (const route of routes) {
  htmlByRoute.set(route.path, await readFile(new URL(route.file, publicDir), 'utf8'))
}

function mainHtml(html) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
  return match?.[1] ?? ''
}

function ids(html) {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]))
}

function internalLinks(html) {
  return [...html.matchAll(/<a\b[^>]*\shref="([^"]+)"[^>]*>/gi)].map(match => match[1])
}

const pageChecks = []
const failures = []

for (const route of routes) {
  const html = htmlByRoute.get(route.path)
  const main = mainHtml(html)
  const h1Count = (main.match(/<h1\b/gi) ?? []).length
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? ''
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? ''
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
    canonical,
    hasDescription: /<meta name="description" content="[^"]+"/i.test(html),
    forbidden,
    brokenLinks,
    hasRuntimeHomeApi: html.includes('/api/home')
  }
  pageChecks.push(check)

  if (!check.titleMatches) failures.push(`${route.path}: 页面标题不符`)
  if (check.h1Count !== 1) failures.push(`${route.path}: H1 数量为 ${check.h1Count}`)
  if (!check.canonical) failures.push(`${route.path}: 缺少 canonical`)
  if (!check.hasDescription) failures.push(`${route.path}: 缺少 description`)
  if (check.forbidden.length) failures.push(`${route.path}: 存在不应公开的文字 ${check.forbidden.join('、')}`)
  if (check.brokenLinks.length) failures.push(`${route.path}: 存在失效链接 ${check.brokenLinks.join('、')}`)
  if (check.hasRuntimeHomeApi) failures.push(`${route.path}: 仍依赖运行时首页 API`)
}

let englishPageGenerated = false
try {
  await access(new URL('en/index.html', publicDir))
  englishPageGenerated = true
} catch {
  englishPageGenerated = false
}

const home = htmlByRoute.get('/')
const services = htmlByRoute.get('/services')
const approach = htmlByRoute.get('/approach')
const globalChecks = {
  routeCount: routes.length,
  simplifiedAddressPresent: [...htmlByRoute.values()].every(html => html.includes('中国·江苏·无锡')),
  aboutKeptOnHomepage: ids(home).has('about'),
  englishPageGenerated,
  reviewFileExists: true,
  homeNavigationPresent: /<a[^>]+href="\/"[^>]*>首页<\/a>/.test(home),
  serviceCaseCount: (services.match(/class="case-card"/g) ?? []).length,
  expandedCaseListsPresent: services.includes('case-service-list') && services.includes('case-bullet-list'),
  semanticServiceHeroLines: (services.match(/class="page-hero-title-line"/g) ?? []).length === 2,
  semanticApproachHeroLines: (approach.match(/class="page-hero-title-line"/g) ?? []).length === 2,
  protectedIndustryPhrase: services.includes('<span class="no-wrap-phrase">质量标准、测试方式和AI方案</span>'),
  protectedCollaborationPhrase: approach.includes('<span class="no-wrap-phrase">交付末期才讨论</span>')
}

if (!globalChecks.simplifiedAddressPresent) failures.push('并非所有页面均使用简化地址“中国·江苏·无锡”')
if (!globalChecks.aboutKeptOnHomepage) failures.push('首页缺少“关于我们”锚点')
if (globalChecks.englishPageGenerated) failures.push('本轮不应生成英文页面')
if (!globalChecks.homeNavigationPresent) failures.push('主导航缺少首位“首页”')
if (globalChecks.serviceCaseCount !== 5) failures.push(`案例数量应为 5，实际为 ${globalChecks.serviceCaseCount}`)
if (!globalChecks.expandedCaseListsPresent) failures.push('案例未按项目范围、项目问题和处理方法展开')
if (!globalChecks.semanticServiceHeroLines) failures.push('服务页主标题未按两行语义组输出')
if (!globalChecks.semanticApproachHeroLines) failures.push('协作方式页主标题未按两行语义组输出')
if (!globalChecks.protectedIndustryPhrase) failures.push('行业描述中的关键短语未作防拆分处理')
if (!globalChecks.protectedCollaborationPhrase) failures.push('协作说明中的句尾关键短语未作防拆分处理')

try {
  await readFile(new URL('../deliverables/源译官网_中文版_第二阶段审核预览_V0.5.html', import.meta.url), 'utf8')
} catch {
  globalChecks.reviewFileExists = false
  failures.push('缺少中文版单文件审核版')
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
