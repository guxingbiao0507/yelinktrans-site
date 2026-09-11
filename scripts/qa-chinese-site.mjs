import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const baseUrl = 'http://127.0.0.1:4173'
const routes = [
  { path: '/', name: 'home' },
  { path: '/services', name: 'services' },
  { path: '/approach', name: 'approach' },
  { path: '/contact', name: 'contact' },
  { path: '/privacy', name: 'privacy' }
]
const viewports = [
  { width: 360, height: 800, name: 'mobile' },
  { width: 768, height: 900, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' }
]

const outputDir = new URL('../qa-v04-zh/', import.meta.url)
await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: chromium.executablePath()
})
const report = []

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport })

  for (const route of routes) {
    const page = await context.newPage()
    const consoleErrors = []
    const pageErrors = []
    const requestFailures = []

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    page.on('pageerror', error => pageErrors.push(error.message))
    page.on('requestfailed', request => requestFailures.push(`${request.method()} ${request.url()}`))

    const response = await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle' })
    await page.screenshot({
      path: new URL(`${viewport.name}-${route.name}.png`, outputDir),
      fullPage: true
    })

    const checks = await page.evaluate(() => {
      const root = document.documentElement
      const h1Count = document.querySelectorAll('main h1').length
      const missingIcons = [...document.querySelectorAll('svg.iconify')]
        .filter(icon => icon.getBoundingClientRect().width === 0 || icon.getBoundingClientRect().height === 0)
        .length
      const clippedText = [...document.querySelectorAll('h1, h2, h3, h4, p, li, a, strong, small')]
        .filter((element) => {
          const style = getComputedStyle(element)
          const clipped = element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2
          return clipped && ['hidden', 'clip'].includes(style.overflow)
        })
        .slice(0, 10)
        .map(element => ({ tag: element.tagName, text: element.textContent?.trim().slice(0, 80) }))

      return {
        title: document.title,
        h1Count,
        horizontalOverflow: root.scrollWidth > window.innerWidth + 1,
        documentWidth: root.scrollWidth,
        viewportWidth: window.innerWidth,
        missingIcons,
        clippedText
      }
    })

    if (viewport.width <= 900) {
      await page.locator('.menu-toggle').click()
      checks.mobileMenuVisible = await page.locator('.primary-nav').evaluate(element => getComputedStyle(element).display !== 'none')
    }

    report.push({
      route: route.path,
      viewport,
      status: response?.status(),
      ...checks,
      consoleErrors,
      pageErrors,
      requestFailures
    })
    await page.close()
  }

  await context.close()
}

await browser.close()
await writeFile(new URL('qa-report.json', outputDir), JSON.stringify(report, null, 2))

const failures = report.filter(item =>
  item.status !== 200 ||
  item.h1Count !== 1 ||
  item.horizontalOverflow ||
  item.missingIcons ||
  item.clippedText.length ||
  item.consoleErrors.length ||
  item.pageErrors.length ||
  item.requestFailures.length ||
  (item.viewport.width <= 900 && !item.mobileMenuVisible)
)

console.log(JSON.stringify({ checks: report.length, failures }, null, 2))
if (failures.length) process.exitCode = 1
