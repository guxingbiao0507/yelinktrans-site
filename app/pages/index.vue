<script setup lang="ts">
import { company } from '~/config/site'

const route = useRoute()
const { siteLocale, copy, localizeHref } = useSiteLocale()
const { data: home } = await useAsyncData(`home-${siteLocale.value}`, () => (
  siteLocale.value === 'en'
    ? queryCollection('homeEn').first()
    : queryCollection('homeZh').first()
))
const serviceAnchors = ['localization', 'ai-solutions', 'data', 'testing']

if (!home.value) {
  throw createError({ statusCode: 404, statusMessage: siteLocale.value === 'en' ? 'Home page content not found' : '首页内容不存在' })
}

const config = useRuntimeConfig()
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  alternateName: company.englishLegalName,
  url: config.public.siteUrl,
  foundingDate: company.founded,
  email: [company.primaryEmail, company.secondaryEmail],
  address: {
    '@type': 'PostalAddress',
    addressLocality: siteLocale.value === 'en' ? 'Wuxi' : '无锡市',
    addressRegion: siteLocale.value === 'en' ? 'Jiangsu' : '江苏省',
    addressCountry: 'CN'
  }
}

usePageSeo({
  title: home.value.seo.title,
  description: home.value.seo.description,
  path: route.path,
  locale: siteLocale.value,
  imageAlt: siteLocale.value === 'en' ? 'Yelinktrans | Expertise That Translates, Value That Travels' : '无锡源译｜源于专业，译见价值'
})

useHead({
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(organizationSchema) }
  ]
})
</script>

<template>
  <div v-if="home" class="site-shell" :class="{ 'site-shell-en': siteLocale === 'en' }">
    <SiteHeader />

    <main id="main-content">
      <section class="hero section" aria-labelledby="hero-title">
        <div class="hero-grid container">
          <div class="hero-copy">
            <p class="eyebrow reveal reveal-1">{{ home.hero.eyebrow }}</p>
            <h1 id="hero-title" class="hero-title reveal reveal-2">
              {{ home.hero.title }}<span>{{ home.hero.highlight }}</span>
            </h1>
            <p class="hero-description reveal reveal-3">{{ home.hero.description }}</p>
            <div class="hero-actions reveal reveal-4">
              <a class="button button-primary" :href="localizeHref(home.hero.primaryCta.href)">
                {{ home.hero.primaryCta.label }}
                <Icon name="lucide:arrow-up-right" aria-hidden="true" />
              </a>
              <a class="button button-ghost" :href="localizeHref(home.hero.secondaryCta.href)">
                {{ home.hero.secondaryCta.label }}
              </a>
            </div>
            <p class="hero-note reveal reveal-4">
              <Icon name="lucide:map-pin" aria-hidden="true" />
              {{ home.hero.note }}
            </p>
          </div>

          <HeroNetworkGraphic class="reveal reveal-3" />
        </div>

        <div class="claims-wrap container reveal reveal-4" :aria-label="copy.claimsLabel">
          <article v-for="claim in home.claims" :key="claim.label" class="claim-card">
            <strong>{{ claim.value }}</strong>
            <span>{{ claim.label }}</span>
            <small>{{ claim.qualifier }}</small>
          </article>
        </div>
      </section>

      <section class="section section-services" aria-labelledby="services-title">
        <span id="services" class="section-anchor" aria-hidden="true" />
        <div class="container">
          <SectionIntro
            :eyebrow="home.services.eyebrow"
            :title="home.services.title"
            :mobile-title="home.services.mobileTitle"
            :description="home.services.description"
            title-id="services-title"
          />
          <div class="service-grid">
            <article v-for="(service, index) in home.services.items" :key="service.title" class="service-card">
              <div class="card-topline">
                <span class="icon-box"><Icon :name="service.icon" aria-hidden="true" /></span>
                <span class="card-index">0{{ index + 1 }}</span>
              </div>
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
              <NuxtLink :to="localizeHref(`/services#${serviceAnchors[index]}`)" class="text-link">
                {{ copy.serviceDetail }}
                <Icon name="lucide:arrow-right" aria-hidden="true" />
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>

      <section class="section section-industries" aria-labelledby="industries-title">
        <span id="industries" class="section-anchor" aria-hidden="true" />
        <div class="container">
          <SectionIntro
            :eyebrow="home.industries.eyebrow"
            :title="home.industries.title"
            :description="home.industries.description"
            :description-no-wrap-text="home.industries.descriptionNoWrapText"
            :description-single-line="home.industries.descriptionSingleLine"
            title-id="industries-title"
            align="left"
          />
          <div class="industry-grid">
            <article v-for="industry in home.industries.items" :key="industry.title" class="industry-card">
              <div class="industry-visual" aria-hidden="true">
                <Icon :name="industry.icon" />
                <span class="industry-orbit" />
              </div>
              <div class="industry-copy">
                <h3>{{ industry.title }}</h3>
                <p>{{ industry.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section section-approach" aria-labelledby="approach-title">
        <span id="approach" class="section-anchor" aria-hidden="true" />
        <div class="container approach-grid">
          <div class="approach-copy">
            <p class="eyebrow eyebrow-light">{{ home.approach.eyebrow }}</p>
            <h2 id="approach-title">{{ home.approach.title }}</h2>
            <p>{{ home.approach.description }}</p>
            <div class="approach-callout">
              <Icon name="lucide:blend" aria-hidden="true" />
              <template v-for="(item, index) in home.approach.calloutItems" :key="item">
                <Icon v-if="index" class="approach-plus" name="lucide:plus" aria-hidden="true" />
                <span>{{ item }}</span>
              </template>
            </div>
          </div>
          <ol class="step-list">
            <li v-for="step in home.approach.steps" :key="step.number">
              <span class="step-number">{{ step.number }}</span>
              <div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section class="section section-trust" aria-labelledby="trust-title">
        <span id="about" class="section-anchor" aria-hidden="true" />
        <div class="container trust-grid">
          <div class="trust-heading">
            <p class="eyebrow">{{ home.trust.eyebrow }}</p>
            <h2 id="trust-title">{{ home.trust.title }}</h2>
            <p>{{ home.trust.description }}</p>
          </div>
          <div class="trust-list">
            <article v-for="item in home.trust.items" :key="item.title">
              <span class="icon-box icon-box-soft"><Icon :name="item.icon" aria-hidden="true" /></span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section section-contact" aria-labelledby="contact-title">
        <span id="contact" class="section-anchor" aria-hidden="true" />
        <div class="contact-card container">
          <div>
            <p class="eyebrow eyebrow-light">{{ home.contact.eyebrow }}</p>
            <h2 id="contact-title">{{ home.contact.title }}</h2>
            <p>{{ home.contact.description }}</p>
          </div>
          <div class="contact-actions">
            <a class="button button-light" :href="home.contact.primaryCta.href">
              <Icon name="lucide:send" aria-hidden="true" />
              {{ home.contact.primaryCta.label }}
            </a>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
