<script setup lang="ts">
const props = withDefaults(defineProps<{
  eyebrow: string
  title: string
  titleLines?: string[]
  mobileTitle?: string
  description?: string
  descriptionLines?: string[]
  descriptionNoWrapText?: string
  descriptionSingleLine?: boolean
  titleId: string
  align?: 'center' | 'left'
}>(), {
  align: 'center'
})

const descriptionParts = computed(() => {
  if (!props.description) return null
  const noWrapText = props.descriptionNoWrapText?.trim()
  if (!noWrapText) return null

  const start = props.description.indexOf(noWrapText)
  if (start === -1) return null

  return {
    before: props.description.slice(0, start),
    noWrap: noWrapText,
    after: props.description.slice(start + noWrapText.length)
  }
})
</script>

<template>
  <div class="section-intro" :class="`section-intro-${align}`">
    <p class="eyebrow">{{ eyebrow }}</p>
    <h2 :id="titleId">
      <template v-if="titleLines?.length">
        <span v-for="line in titleLines" :key="line" class="section-title-line">{{ line }}</span>
      </template>
      <template v-else>
        <span :class="{ 'section-title-desktop': mobileTitle }">{{ title }}</span>
        <span v-if="mobileTitle" class="section-title-mobile">{{ mobileTitle }}</span>
      </template>
    </h2>
    <p
      v-if="description"
      :class="{
        'section-description-structured': descriptionLines?.length,
        'section-description-single-line': descriptionSingleLine
      }"
    >
      <template v-if="descriptionLines?.length">
        <span
          v-for="line in descriptionLines"
          :key="line"
          class="section-description-line"
        >{{ line }}</span>
      </template>
      <template v-else-if="descriptionParts">
        {{ descriptionParts.before }}<span class="no-wrap-phrase">{{ descriptionParts.noWrap }}</span>{{ descriptionParts.after }}
      </template>
      <template v-else>{{ description }}</template>
    </p>
  </div>
</template>
