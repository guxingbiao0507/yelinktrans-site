<script setup lang="ts">
const route = useRoute()
const { siteLocale, copy } = useSiteLocale()
const { data: page } = await useAsyncData(`privacy-${siteLocale.value}`, () => (
  siteLocale.value === 'en'
    ? queryCollection('privacyEn').first()
    : queryCollection('privacyZh').first()
))

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: siteLocale.value === 'en' ? 'Privacy policy content not found' : '隐私政策页面内容不存在' })
}

usePageSeo({
  title: page.value.seo.title,
  description: page.value.seo.description,
  path: route.path,
  locale: siteLocale.value
})
</script>

<template>
  <div v-if="page" class="site-shell" :class="{ 'site-shell-en': siteLocale === 'en' }">
    <SiteHeader />
    <main id="main-content">
      <PageHero v-bind="page.hero" />

      <section class="section privacy-section">
        <div class="container privacy-layout">
          <aside class="privacy-nav" :aria-label="copy.privacyToc">
            <div class="privacy-date">
              <span>{{ copy.updatedLabel }}{{ copy.fieldSeparator }} {{ page.updated }}</span>
              <span>{{ copy.effectiveLabel }}{{ copy.fieldSeparator }} {{ page.effective }}</span>
            </div>
            <nav>
              <a v-for="section in page.sections" :key="section.id" :href="`#${section.id}`">
                {{ section.title }}
              </a>
            </nav>
          </aside>

          <article class="privacy-content">
            <section v-for="section in page.sections" :id="section.id" :key="section.id">
              <h2>{{ section.title }}</h2>
              <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
              <ul v-if="section.bullets">
                <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
              </ul>
              <div v-for="subsection in section.subsections" :key="subsection.title" class="privacy-subsection">
                <h3>{{ subsection.title }}</h3>
                <p v-for="paragraph in subsection.paragraphs" :key="paragraph">{{ paragraph }}</p>
                <ul v-if="subsection.bullets">
                  <li v-for="bullet in subsection.bullets" :key="bullet">{{ bullet }}</li>
                </ul>
              </div>
            </section>
          </article>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
