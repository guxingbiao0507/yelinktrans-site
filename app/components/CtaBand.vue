<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}>()

const { copy, localizeHref } = useSiteLocale()
</script>

<template>
  <section class="section section-contact" :aria-label="copy.contactSectionLabel">
    <div class="contact-card container">
      <div>
        <p v-if="eyebrow" class="eyebrow eyebrow-light">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
      <div class="contact-actions">
        <NuxtLink class="button button-light" :to="localizeHref(primaryHref)">
          <Icon name="lucide:arrow-up-right" aria-hidden="true" />
          {{ primaryLabel }}
        </NuxtLink>
        <NuxtLink
          v-if="secondaryLabel && secondaryHref"
          class="button button-outline-light"
          :to="localizeHref(secondaryHref)"
        >{{ secondaryLabel }}</NuxtLink>
      </div>
    </div>
  </section>
</template>
