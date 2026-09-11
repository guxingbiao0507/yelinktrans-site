<script setup lang="ts">
const route = useRoute()
const { siteLocale, localizeHref } = useSiteLocale()
const { data: page } = await useAsyncData(`contact-${siteLocale.value}`, () => (
  siteLocale.value === 'en'
    ? queryCollection('contactEn').first()
    : queryCollection('contactZh').first()
))

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: siteLocale.value === 'en' ? 'Contact page content not found' : '联系合作页面内容不存在' })
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

      <section class="section contact-methods-section" aria-labelledby="contact-methods-title">
        <div class="container contact-methods-grid">
          <div class="contact-methods-copy">
            <p class="eyebrow">{{ page.methods.eyebrow }}</p>
            <h2 id="contact-methods-title">{{ page.methods.title }}</h2>
            <p>{{ page.methods.description }}</p>
          </div>
          <div class="contact-method-list">
            <article v-for="item in page.methods.items" :key="item.label">
              <span class="icon-box icon-box-soft"><Icon :name="item.icon" aria-hidden="true" /></span>
              <div>
                <small>{{ item.label }}</small>
                <a v-if="item.href" :href="item.href">{{ item.value }}</a>
                <strong v-else>{{ item.value }}</strong>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section brief-section" aria-labelledby="brief-title">
        <div class="container">
          <SectionIntro
            :eyebrow="page.brief.eyebrow"
            :title="page.brief.title"
            :description="page.brief.description"
            title-id="brief-title"
            align="left"
          />
          <div class="brief-grid">
            <article v-for="(item, index) in page.brief.items" :key="item.title">
              <span>0{{ index + 1 }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </div>

          <aside class="safety-note" aria-labelledby="safety-title">
            <Icon name="lucide:shield-check" aria-hidden="true" />
            <div>
              <h2 id="safety-title">{{ page.safety.title }}</h2>
              <p v-for="paragraph in page.safety.paragraphs" :key="paragraph">{{ paragraph }}</p>
            </div>
          </aside>

          <div class="contact-page-actions">
            <a class="button button-primary" :href="page.primaryCta.href">
              <Icon name="lucide:send" aria-hidden="true" />
              {{ page.primaryCta.label }}
            </a>
            <NuxtLink class="button button-ghost" :to="localizeHref(page.secondaryCta.href)">{{ page.secondaryCta.label }}</NuxtLink>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
