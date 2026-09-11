<script setup lang="ts">
import { primaryNavigation } from '~/config/site'

const menuOpen = ref(false)
const route = useRoute()
const { siteLocale, copy, switchLocalePath, localizeHref } = useSiteLocale()
const navigation = computed(() => primaryNavigation[siteLocale.value])
const alternateLocale = computed(() => siteLocale.value === 'zh' ? 'en' : 'zh')
const alternateLocalePath = computed(() => switchLocalePath(alternateLocale.value) || (alternateLocale.value === 'en' ? '/en' : '/'))

const isCurrent = (href: string) => {
  if (href.includes('#')) return false
  return route.path === localizeHref(href)
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <a class="skip-link" href="#main-content">{{ copy.skipLink }}</a>
    <div class="header-inner container">
      <NuxtLink class="wordmark" :to="localizeHref('/')" :aria-label="copy.homeLabel" @click="closeMenu">
        <span class="wordmark-symbol" aria-hidden="true">
          <span>Y</span>
        </span>
        <span class="wordmark-copy">
          <strong>{{ siteLocale === 'zh' ? '源译' : 'YELINKTRANS' }}</strong>
          <small>{{ siteLocale === 'zh' ? 'YELINKTRANS' : 'LANGUAGE · DATA · AI' }}</small>
        </span>
      </NuxtLink>

      <nav id="primary-navigation" class="primary-nav" :class="{ 'is-open': menuOpen }" :aria-label="copy.navigationLabel">
        <NuxtLink
          v-for="link in navigation"
          :key="link.href"
          :to="localizeHref(link.href)"
          :aria-current="isCurrent(link.href) ? 'page' : undefined"
          :class="{ 'is-current': isCurrent(link.href) }"
          @click="closeMenu"
        >{{ link.label }}</NuxtLink>
        <NuxtLink
          class="language-link"
          :to="alternateLocalePath"
          :aria-label="copy.switchLanguageLabel"
          @click="closeMenu"
        >{{ copy.switchLanguageText }}</NuxtLink>
        <NuxtLink class="button button-primary header-cta" :to="localizeHref('/contact')" @click="closeMenu">{{ copy.contactLabel }}</NuxtLink>
      </nav>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="primary-navigation"
        :aria-label="menuOpen ? copy.closeMenu : copy.openMenu"
        @click="menuOpen = !menuOpen"
      >
        <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" aria-hidden="true" />
      </button>
    </div>
  </header>
</template>
