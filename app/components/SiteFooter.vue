<script setup lang="ts">
import { company, footerNavigation } from '~/config/site'

const { siteLocale, copy, localizeHref } = useSiteLocale()
const navigation = computed(() => footerNavigation[siteLocale.value])
const location = computed(() => siteLocale.value === 'en' ? company.locationEnglish : company.location)
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <NuxtLink class="wordmark wordmark-footer" :to="localizeHref('/')" :aria-label="copy.returnHomeLabel">
          <span class="wordmark-symbol" aria-hidden="true"><span>Y</span></span>
          <span class="wordmark-copy">
            <strong>{{ siteLocale === 'zh' ? '源译' : 'YELINKTRANS' }}</strong>
            <small>{{ siteLocale === 'zh' ? 'YELINKTRANS' : 'LANGUAGE · DATA · AI' }}</small>
          </span>
        </NuxtLink>
        <p>{{ copy.footerTagline }}</p>
      </div>
      <div>
        <h2>{{ copy.quickNavigation }}</h2>
        <NuxtLink v-for="link in navigation" :key="link.href" :to="localizeHref(link.href)">{{ link.label }}</NuxtLink>
      </div>
      <div>
        <h2>{{ copy.contactHeading }}</h2>
        <p class="footer-contact-line">
          <a :href="`mailto:${company.primaryEmail}`">{{ company.primaryEmail }}</a>
          <span>{{ copy.emailSeparator }}</span>
          <a :href="`mailto:${company.secondaryEmail}`">{{ company.secondaryEmail }}</a>
        </p>
        <p>{{ location }}</p>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© 2026 {{ company.englishLegalName }} All rights reserved.</p>
      <NuxtLink :to="localizeHref('/privacy')">{{ copy.privacyPolicy }}</NuxtLink>
    </div>
  </footer>
</template>
