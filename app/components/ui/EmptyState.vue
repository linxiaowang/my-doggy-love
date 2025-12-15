<template>
  <div class="w-full py-16 flex flex-col items-center justify-center text-center animate-fade-in">
    <div class="relative mb-6">
      <img :src="img" loading="lazy" alt="empty" class="w-40 h-40 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-lg shadow-sm" />
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-background/30 pointer-events-none rounded-lg"></div>
    </div>
    <div class="text-base font-medium text-muted-foreground mb-4">{{ text }}</div>
    <NuxtLink
      v-if="ctaTo && ctaText"
      :to="ctaTo"
      class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors shadow-sm hover:shadow-md"
    >
      {{ ctaText }}
    </NuxtLink>
  </div>

</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ text?: string; img?: string; ctaText?: string; ctaTo?: string }>(), {
  text: '暂无记录',
  img: '/assets/images/xiaobai/xiaobai-4.png'
})
</script>


