<script setup lang="ts">
const route = useRoute()
const { siteLocale } = useSiteLocale()
const { data: page } = await useAsyncData(`approach-${siteLocale.value}`, () => (
  siteLocale.value === 'en'
    ? queryCollection('approachEn').first()
    : queryCollection('approachZh').first()
))

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: siteLocale.value === 'en' ? 'Working approach content not found' : '协作方式页面内容不存在' })
}

const collaborationDescriptionParts = computed(() => {
  const collaboration = page.value?.collaboration
  const noWrapText = collaboration?.descriptionNoWrapText?.trim()
  if (!collaboration || !noWrapText) return null

  const start = collaboration.description.indexOf(noWrapText)
  if (start === -1) return null

  return {
    before: collaboration.description.slice(0, start),
    noWrap: noWrapText,
    after: collaboration.description.slice(start + noWrapText.length)
  }
})

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

      <section class="section approach-intro-section" aria-labelledby="approach-intro-title">
        <div class="container approach-intro-grid">
          <div>
            <p class="eyebrow">{{ page.intro.eyebrow }}</p>
            <h2 id="approach-intro-title">{{ page.intro.title }}</h2>
          </div>
          <div class="approach-intro-copy">
            <p v-for="paragraph in page.intro.paragraphs" :key="paragraph">{{ paragraph }}</p>
            <div class="approach-formula">
              <Icon name="lucide:blend" aria-hidden="true" />
              {{ page.intro.callout }}
            </div>
          </div>
        </div>
      </section>

      <section class="section process-section" aria-labelledby="process-title">
        <div class="container">
          <SectionIntro
            :eyebrow="page.steps.eyebrow"
            :title="page.steps.title"
            :description="page.steps.description"
            title-id="process-title"
            align="left"
          />
          <ol class="process-list">
            <li v-for="step in page.steps.items" :key="step.number">
              <div class="process-number">{{ step.number }}</div>
              <div class="process-icon"><Icon :name="step.icon" aria-hidden="true" /></div>
              <div class="process-copy">
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
              </div>
              <div class="process-outputs">
                <span v-for="output in step.outputs" :key="output">{{ output }}</span>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section class="section scenarios-section" aria-labelledby="scenarios-title">
        <div class="container">
          <SectionIntro
            :eyebrow="page.scenarios.eyebrow"
            :title="page.scenarios.title"
            :description="page.scenarios.description"
            title-id="scenarios-title"
          />
          <div class="scenario-grid">
            <article v-for="(item, index) in page.scenarios.items" :key="item.title">
              <span>0{{ index + 1 }}</span>
              <h3>
                <template v-if="item.titleLines?.length">
                  <span
                    v-for="line in item.titleLines"
                    :key="line"
                    class="scenario-title-line"
                  >{{ line }}</span>
                </template>
                <template v-else>{{ item.title }}</template>
              </h3>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section collaboration-section" aria-labelledby="collaboration-title">
        <div class="container">
          <div class="collaboration-heading">
            <p class="eyebrow eyebrow-light">{{ page.collaboration.eyebrow }}</p>
            <h2 id="collaboration-title">
              <template v-if="page.collaboration.titleLines?.length">
                <span
                  v-for="line in page.collaboration.titleLines"
                  :key="line"
                  class="collaboration-title-line"
                >{{ line }}</span>
              </template>
              <template v-else>{{ page.collaboration.title }}</template>
            </h2>
            <p :class="{ 'collaboration-description-structured': page.collaboration.descriptionLines?.length }">
              <template v-if="page.collaboration.descriptionLines?.length">
                <span
                  v-for="line in page.collaboration.descriptionLines"
                  :key="line"
                  class="collaboration-description-line"
                >{{ line }}</span>
              </template>
              <template v-else-if="collaborationDescriptionParts">
                {{ collaborationDescriptionParts.before }}<span class="no-wrap-phrase">{{ collaborationDescriptionParts.noWrap }}</span>{{ collaborationDescriptionParts.after }}
              </template>
              <template v-else>{{ page.collaboration.description }}</template>
            </p>
          </div>
          <div class="responsibility-grid">
            <article>
              <h3>{{ page.collaboration.clientTitle }}</h3>
              <ul class="check-list check-list-light">
                <li v-for="item in page.collaboration.clientItems" :key="item">
                  <Icon name="lucide:circle-check" aria-hidden="true" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </article>
            <article>
              <h3>{{ page.collaboration.yelinkTitle }}</h3>
              <ul class="check-list check-list-light">
                <li v-for="item in page.collaboration.yelinkItems" :key="item">
                  <Icon name="lucide:circle-check" aria-hidden="true" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <CtaBand
        :eyebrow="page.cta.eyebrow"
        :title="page.cta.title"
        :description="page.cta.description"
        :primary-label="page.cta.primary.label"
        :primary-href="page.cta.primary.href"
        :secondary-label="page.cta.secondary.label"
        :secondary-href="page.cta.secondary.href"
      />
    </main>
    <SiteFooter />
  </div>
</template>
