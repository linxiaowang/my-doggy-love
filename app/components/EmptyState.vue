<script setup lang="ts">
import type { LineDogScene } from '@/constants/lineDogStickers'

withDefaults(defineProps<{
  text?: string
  scene?: LineDogScene
  img?: string
  ctaText?: string
  ctaTo?: string
}>(), {
  text: '暂无记录',
  scene: 'empty',
})
</script>

<template>
  <div class="w-full py-14 flex flex-col items-center justify-center text-center animate-fade-in">
    <div class="relative mb-5">
      <LineDogSticker
        v-if="!img"
        :scene="scene"
        size="xl"
        wobble
      />
      <img
        v-else
        :src="img"
        loading="lazy"
        alt="empty"
        class="w-40 h-40 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-2xl shadow-sm"
      >
    </div>
    <div class="font-display text-lg text-muted-foreground mb-4">
      {{ text }}
    </div>
    <NuxtLink
      v-if="ctaTo && ctaText"
      :to="ctaTo"
      class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-colors shadow-sm hover:shadow-md"
    >
      {{ ctaText }}
    </NuxtLink>
  </div>
</template>
