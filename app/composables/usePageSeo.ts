interface PageSeoOptions {
  title: string
  description: string
  path: string
  locale?: 'zh' | 'en'
  imageAlt?: string
}

export function usePageSeo(options: PageSeoOptions) {
  const config = useRuntimeConfig()
  const normalizedPath = options.path === '/' ? '/' : `/${options.path.replace(/^\/+|\/+$/g, '')}`
  const canonicalUrl = `${config.public.siteUrl}${normalizedPath}`
  const locale = options.locale === 'en' ? 'en' : 'zh'
  const imageUrl = `${config.public.siteUrl}/${locale === 'en' ? 'og-image-en.png' : 'og-image.png'}`
  const basePath = normalizedPath.replace(/^\/en(?=\/|$)/, '') || '/'
  const zhUrl = `${config.public.siteUrl}${basePath}`
  const enUrl = `${config.public.siteUrl}${basePath === '/' ? '/en' : `/en${basePath}`}`

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogType: 'website',
    ogUrl: canonicalUrl,
    ogLocale: locale === 'en' ? 'en_US' : 'zh_CN',
    ogImage: imageUrl,
    ogImageAlt: options.imageAlt || options.title,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image',
    twitterImage: imageUrl,
    twitterImageAlt: options.imageAlt || options.title
  })

  useHead({
    htmlAttrs: { lang: locale === 'en' ? 'en-US' : 'zh-CN' },
    link: [
      { rel: 'canonical', href: canonicalUrl },
      { rel: 'alternate', hreflang: 'zh-CN', href: zhUrl },
      { rel: 'alternate', hreflang: 'en', href: enUrl },
      { rel: 'alternate', hreflang: 'x-default', href: zhUrl }
    ]
  })
}
