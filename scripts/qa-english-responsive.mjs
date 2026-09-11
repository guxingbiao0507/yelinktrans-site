import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = new URL('../', import.meta.url)
const staticRoot = process.env.STATIC_OUTPUT_DIR
  ? pathToFileURL(path.resolve(process.env.STATIC_OUTPUT_DIR) + path.sep)
  : new URL('.output/public/', root)
const sourceCss = await readFile(new URL('app/assets/css/main.css', root), 'utf8')
const css = sourceCss.replace(/\s+/g, ' ')
const enHome = await readFile(new URL('en/index.html', staticRoot), 'utf8')
const enServices = await readFile(new URL('en/services/index.html', staticRoot), 'utf8')
const enApproach = await readFile(new URL('en/approach/index.html', staticRoot), 'utf8')
const finalHtml = await readFile(new URL('deliverables/源译官网_英文版_定稿_V1.2.html', root), 'utf8')

function block(selector) {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) return ''
  return css.slice(start, css.indexOf('}', start) + 1)
}

function headingContainsBreak(html) {
  const headings = html.match(/<h[12]\b[^>]*>[\s\S]*?<\/h[12]>/gi) ?? []
  return headings.some(heading => /<br\b/i.test(heading))
}

const englishCardTitleBlock = block("html[lang^='en'] .service-card h3")
const footerHeadingBlock = block("html[lang^='en'] .footer-grid h2")

const checks = {
  equalFourColumnGrid: css.includes('grid-template-columns: repeat(4, minmax(0, 1fr));'),
  equalTwoColumnGrid: css.includes('grid-template-columns: repeat(2, minmax(0, 1fr));'),
  englishCardTitlesCanWrap: englishCardTitleBlock.includes('white-space: normal;'),
  noWrapIsResponsive: block('.no-wrap-phrase').includes('white-space: normal;')
    && css.includes('@media (min-width: 901px) { .no-wrap-phrase { display: inline-block; white-space: nowrap;'),
  laptopHeroUsesSingleColumn: css.includes("html[lang^='en'] .hero-grid { min-height: 0; grid-template-columns: 1fr; }"),
  footerHeadingsShareExplicitStyle: footerHeadingBlock.includes('font-size: 0.76rem;')
    && footerHeadingBlock.includes('white-space: nowrap;'),
  heroEyebrowProtectedOnNonMobile: css.includes("html[lang^='en'] .hero-copy > .eyebrow { font-size: 0.7rem; letter-spacing: 0.13em; white-space: nowrap; }"),
  noBreakTagsInEnglishHeadings: ![enHome, enServices, enApproach].some(headingContainsBreak),
  approvedHeroCopy: enHome.includes('Expertise That Translates') && enHome.includes('Value That Travels'),
  protectedPhrasesRendered: [enHome, enServices].every(html => html.includes('no-wrap-phrase'))
    && enApproach.includes('collaboration-description-line'),
  homeIndustryDescriptionIsSingleLineOnLaptop: css.includes("html[lang^='en'] .section-industries .section-description-single-line { max-width: none; font-size: clamp(0.75rem, 1.05vw, 0.925rem); white-space: nowrap; }"),
  serviceOverviewUsesThreeLineStructure: (enServices.match(/class="section-description-line"/g) ?? []).length >= 2
    && enServices.includes('Quality expectations and the right level of human oversight vary by content and business stage.'),
  scenarioHeadingsUseTwoLines: (enApproach.match(/class="scenario-title-line"/g) ?? []).length === 8,
  scenarioDescriptionsShareTopLine: css.includes("html[lang^='en'] .scenario-grid h3 { min-height: 2.7rem; line-height: 1.35; }"),
  collaborationSentencesUseSeparateLines: (enApproach.match(/class="collaboration-description-line"/g) ?? []).length === 2,
  standaloneHasFivePages: (finalHtml.match(/<template id="review-/g) ?? []).length === 5,
  standaloneIsSelfContained: !/<link[^>]+href=|<script[^>]+src=|\/_nuxt\//.test(finalHtml)
}

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name)

const report = {
  generatedAt: new Date().toISOString(),
  passed: failed.length === 0,
  checks,
  failed
}

console.log(JSON.stringify(report, null, 2))
if (failed.length) process.exitCode = 1
