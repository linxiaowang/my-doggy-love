<template>
  <div class="w-full py-16 flex flex-col items-center justify-center text-center text-#777 animate-fade-in">
    <div class="relative mb-6">
      <img :src="img" loading="lazy" alt="empty" class="w-40 h-40 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300" />
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-#f7f6f3/50 pointer-events-none"></div>
    </div>
    <div class="text-base font-medium text-#666 mb-2">{{ text }}</div>
    <NuxtLink v-if="ctaTo && ctaText" :to="ctaTo" class="mt-4 btn-secondary text-sm">{{ ctaText }}</NuxtLink>
  </div>
  
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ text?: string; img?: string; ctaText?: string; ctaTo?: string }>(), {
  text: '暂无记录',
  img: '/assets/images/xiaobai/xiaobai-4.png'
})
</script>


