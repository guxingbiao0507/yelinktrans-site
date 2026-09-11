const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://yelinktrans.com'
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const isSubpathDeploy = baseURL !== '/'

function resolveSiteOrigin(url: string) {
  try {
    return new URL(url).origin
  } catch {
    return url
  }
}

function resolvePublicSiteUrl(url: string, base: string) {
  try {
    const parsed = new URL(url)
    const normalizedBase = base === '/' ? '' : base.replace(/\/+$/, '')

    if (parsed.pathname && parsed.pathname !== '/') {
      return url.replace(/\/+$/, '')
    }

    return normalizedBase ? `${parsed.origin}${normalizedBase}` : parsed.origin
  } catch {
    return url
  }
}

const siteOrigin = resolveSiteOrigin(siteUrl)
const publicSiteUrl = resolvePublicSiteUrl(siteUrl, baseURL)
const prerenderRoutes = [
  '/', '/services', '/approach', '/contact', '/privacy',
  '/en', '/en/services', '/en/approach', '/en/contact', '/en/privacy',
  '/sitemap.xml',
  ...(isSubpathDeploy ? [] : ['/robots.txt'])
]

export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  devtools: { enabled: false },
  modules: [
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'theme-color', content: '#0b2b4b' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },
  site: {
    url: publicSiteUrl,
    name: '无锡源译｜Yelinktrans'
  },
  runtimeConfig: {
    public: {
      siteUrl: publicSiteUrl
    }
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'zh',
    baseUrl: siteOrigin,
    detectBrowserLanguage: false,
    locales: [
      { code: 'zh', name: '简体中文', language: 'zh-CN' },
      { code: 'en', name: 'English', language: 'en-US' }
    ]
  },
  robots: isSubpathDeploy
    ? { robotsTxt: false, disallow: [] }
    : { disallow: [] },
  sitemap: {
    autoI18n: false,
    zeroRuntime: true,
    urls: [
      '/', '/services', '/approach', '/contact', '/privacy',
      '/en', '/en/services', '/en/approach', '/en/contact', '/en/privacy'
    ]
  },
  icon: {
    mode: 'svg',
    provider: 'none',
    serverBundle: false,
    clientBundle: {
      scan: false,
      icons: [
        'lucide:menu',
        'lucide:x',
        'lucide:arrow-up-right',
        'lucide:arrow-right',
        'lucide:map-pin',
        'lucide:languages',
        'lucide:sparkles',
        'lucide:database-zap',
        'lucide:scan-search',
        'lucide:smartphone',
        'lucide:panels-top-left',
        'lucide:shopping-bag',
        'lucide:gamepad-2',
        'lucide:blend',
        'lucide:plus',
        'lucide:history',
        'lucide:workflow',
        'lucide:file-check-2',
        'lucide:user-round-check',
        'lucide:send',
        'lucide:target',
        'lucide:clipboard-list',
        'lucide:flask-conical',
        'lucide:rocket',
        'lucide:refresh-cw',
        'lucide:circle-check',
        'lucide:briefcase-business',
        'lucide:mail',
        'lucide:building-2',
        'lucide:clock-3',
        'lucide:shield-check',
        'lucide:info',
        'lucide:file-text',
        'lucide:triangle-alert',
        'lucide:messages-square',
        'lucide:chevron-right'
      ]
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: prerenderRoutes
    }
  },
  typescript: {
    typeCheck: true
  }
})
