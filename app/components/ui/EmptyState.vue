<template>
  <div class="w-full py-12 flex flex-col items-center justify-center text-center text-#777">
    <img :src="img" loading="lazy" alt="empty" class="w-40 h-40 object-contain mb-4 opacity-90" />
    <div class="text-sm">{{ text }}</div>
    <NuxtLink v-if="ctaTo && ctaText" :to="ctaTo" class="mt-3 btn-secondary text-sm">{{ ctaText }}</NuxtLink>
  </div>
  
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ text?: string; img?: string; ctaText?: string; ctaTo?: string }>(), {
  text: '暂无记录',
  img: '/assets/images/xiaobai/xiaobai-4.png'
})
</script>


