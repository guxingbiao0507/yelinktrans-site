<script setup lang="ts">
defineProps<{ error: { statusCode?: number; statusMessage?: string } }>()
</script>

<template>
  <div class="site-shell error-page">
    <SiteHeader />
    <main id="main-content" class="container error-page-content">
      <p class="eyebrow">PAGE NOT FOUND</p>
      <h1>{{ error.statusCode || 404 }}</h1>
      <h2>没有找到您访问的页面</h2>
      <p>{{ error.statusMessage || '页面可能已移动，或者链接地址不完整。' }}</p>
      <NuxtLink class="button button-primary" to="/">返回首页</NuxtLink>
    </main>
    <SiteFooter />
  </div>
</template>
