<script setup lang="ts">
const route = useRoute()
const { siteLocale, copy } = useSiteLocale()
const { data: page } = await useAsyncData(`services-${siteLocale.value}`, () => (
  siteLocale.value === 'en'
    ? queryCollection('servicesEn').first()
    : queryCollection('servicesZh').first()
))

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: siteLocale.value === 'en' ? 'Services and experience content not found' : '服务与经验页面内容不存在' })
}

const serviceRows = computed(() => {
  const services = page.value?.services ?? []
  return Array.from({ length: Math.ceil(services.length / 2) }, (_, index) => services.slice(index * 2, index * 2 + 2))
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

      <section class="section detail-section" aria-labelledby="service-overview-title">
        <div class="container">
          <SectionIntro
            :eyebrow="page.overview.eyebrow"
            :title="page.overview.title"
            :title-lines="page.overview.titleLines"
            :description="page.overview.description"
            :description-lines="page.overview.descriptionLines"
            :description-no-wrap-text="page.overview.descriptionNoWrapText"
            title-id="service-overview-title"
          />

          <div class="service-detail-grid">
            <div v-for="(row, rowIndex) in serviceRows" :key="row[0]?.id" class="service-detail-row">
              <article
                v-for="(service, columnIndex) in row"
                :id="service.id"
                :key="service.id"
                class="service-detail-card"
              >
                <div class="detail-card-heading">
                  <span class="icon-box"><Icon :name="service.icon" aria-hidden="true" /></span>
                  <span class="detail-index">0{{ rowIndex * 2 + columnIndex + 1 }}</span>
                </div>
                <h2>{{ service.title }}</h2>
                <p class="detail-summary">{{ service.summary }}</p>

                <div class="detail-block detail-block-challenge">
                  <h3>{{ copy.commonProblems }}</h3>
                  <p>{{ service.challenge }}</p>
                </div>
                <div class="detail-block detail-block-scope">
                  <h3>{{ copy.serviceScope }}</h3>
                  <ul class="check-list">
                    <li v-for="item in service.scope" :key="item">
                      <Icon name="lucide:circle-check" aria-hidden="true" />
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>
                <div class="experience-note">
                  <strong>{{ copy.relatedExperience }}</strong>
                  <p>{{ service.evidence }}</p>
                </div>
                <div class="boundary-note">
                  <strong>{{ copy.serviceBoundary }}</strong>
                  <p>{{ service.boundary }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="section industry-detail-section" aria-labelledby="industry-detail-title">
        <div class="container">
          <SectionIntro
            :eyebrow="page.industries.eyebrow"
            :title="page.industries.title"
            :title-lines="page.industries.titleLines"
            :description="page.industries.description"
            :description-no-wrap-text="page.industries.descriptionNoWrapText"
            title-id="industry-detail-title"
            align="left"
          />
          <div class="industry-summary-grid">
            <article v-for="industry in page.industries.items" :key="industry.title">
              <span class="icon-box icon-box-soft"><Icon :name="industry.icon" aria-hidden="true" /></span>
              <h3>{{ industry.title }}</h3>
              <p>{{ industry.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="cases" class="section cases-section" aria-labelledby="cases-title">
        <div class="container">
          <SectionIntro
            :eyebrow="page.cases.eyebrow"
            :title="page.cases.title"
            :title-lines="page.cases.titleLines"
            title-id="cases-title"
            align="left"
          />
          <div class="case-list">
            <article v-for="item in page.cases.items" :key="item.id" class="case-card">
              <div class="case-meta">
                <span>{{ item.id }}</span>
                <span>{{ item.industry }}</span>
                <span>{{ copy.coreTeamExperience }}</span>
              </div>
              <div class="case-main">
                <div class="case-heading">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.profile }}</p>
                  <strong>{{ item.scale }}</strong>
                  <div class="case-services">
                    <h4>{{ copy.projectScope }}</h4>
                    <ul class="case-service-list">
                      <li v-for="service in item.services" :key="service">{{ service }}</li>
                    </ul>
                  </div>
                </div>
                <div class="case-content">
                  <div>
                    <h4>{{ copy.projectChallenge }}</h4>
                    <ul class="case-bullet-list">
                      <li v-for="challenge in item.challenge" :key="challenge">{{ challenge }}</li>
                    </ul>
                  </div>
                  <div>
                    <h4>{{ copy.approachTaken }}</h4>
                    <ul class="case-bullet-list">
                      <li v-for="approach in item.approach" :key="approach">{{ approach }}</li>
                    </ul>
                  </div>
                </div>
              </div>
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
