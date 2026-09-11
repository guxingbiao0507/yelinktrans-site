<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow: string
  title: string
  titleLines?: string[]
  description: string
  note?: string
  tags?: string[]
}>(), {
  note: '',
  tags: () => ['LANGUAGE', 'DATA', 'AI']
})
</script>

<template>
  <section class="page-hero" aria-labelledby="page-title">
    <div class="container page-hero-grid">
      <div class="page-hero-copy reveal reveal-1">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1 id="page-title">
          <template v-if="titleLines?.length">
            <span v-for="line in titleLines" :key="line" class="page-hero-title-line">{{ line }}</span>
          </template>
          <template v-else>{{ title }}</template>
        </h1>
        <p class="page-hero-description">{{ description }}</p>
        <p v-if="note" class="page-hero-note">
          <Icon name="lucide:info" aria-hidden="true" />
          {{ note }}
        </p>
      </div>
      <div class="page-hero-graphic reveal reveal-2" aria-hidden="true">
        <span class="page-hero-mesh" />
        <span class="page-hero-orbit orbit-a" />
        <span class="page-hero-orbit orbit-b" />
        <span class="page-hero-connector connector-1" />
        <span class="page-hero-connector connector-2" />
        <span class="page-hero-connector connector-3" />
        <span class="page-hero-core">
          <strong>Y</strong>
          <small>YELINKTRANS</small>
        </span>
        <span
          v-for="(tag, index) in tags"
          :key="tag"
          class="page-hero-tag"
          :class="`page-hero-tag-${index + 1}`"
        >
          <small>0{{ index + 1 }}</small>
          <strong>{{ tag }}</strong>
        </span>
        <span class="page-hero-graphic-caption">LANGUAGE × AI OPERATIONS</span>
      </div>
    </div>
  </section>
</template>
