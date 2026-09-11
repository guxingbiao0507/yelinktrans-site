import { siteCopy, type SiteLocale } from '~/config/site'

export function useSiteLocale() {
  const { locale } = useI18n()
  const localePath = useLocalePath()
  const switchLocalePath = useSwitchLocalePath()
  const siteLocale = computed<SiteLocale>(() => locale.value === 'en' ? 'en' : 'zh')
  const copy = computed(() => siteCopy[siteLocale.value])

  function localizeHref(href: string) {
    if (/^(mailto:|tel:|https?:\/\/|\/\/)/i.test(href) || href.startsWith('#')) return href

    const hashIndex = href.indexOf('#')
    if (hashIndex >= 0) {
      const path = href.slice(0, hashIndex) || '/'
      return `${localePath(path, siteLocale.value)}${href.slice(hashIndex)}`
    }

    return localePath(href, siteLocale.value)
  }

  return {
    locale,
    siteLocale,
    copy,
    localePath,
    switchLocalePath,
    localizeHref
  }
}
