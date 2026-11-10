<script setup lang="ts">
import {
  lineDogForScene,
  lineDogLabels,
  lineDogSrc,
  type LineDogScene,
  type LineDogSlug,
} from '@/constants/lineDogStickers'

const props = withDefaults(defineProps<{
  slug?: LineDogSlug
  scene?: LineDogScene
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  wobble?: boolean
  eager?: boolean
  alt?: string
}>(), {
  size: 'md',
  wobble: false,
  eager: false,
})

const resolved = computed(() => {
  if (props.scene) {
    return lineDogForScene(props.scene)
  }
  const slug = props.slug ?? 'love'
  return {
    slug,
    src: lineDogSrc(slug),
    label: lineDogLabels[slug],
  }
})

const sizeClass = computed(() => ({
  xs: 'w-8 h-8',
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32 md:w-40 md:h-40',
}[props.size]))
</script>

<template>
  <span
    class="line-dog-sticker inline-flex shrink-0 items-center justify-center"
    :class="[sizeClass, wobble && 'line-dog-wobble']"
    role="img"
    :aria-label="alt || resolved.label"
  >
    <img
      :src="resolved.src"
      :alt="alt || resolved.label"
      class="h-full w-full object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
      :loading="eager ? 'eager' : 'lazy'"
      draggable="false"
    >
  </span>
</template>

<style scoped>
.line-dog-wobble {
  animation: line-dog-wobble 2.8s ease-in-out infinite;
  transform-origin: 50% 85%;
}

.line-dog-wobble:hover {
  animation-duration: 1.2s;
}

@keyframes line-dog-wobble {
  0%, 100% { transform: rotate(-2.5deg) translateY(0); }
  50% { transform: rotate(2.5deg) translateY(-2px); }
}

@media (prefers-reduced-motion: reduce) {
  .line-dog-wobble {
    animation: none;
  }
}
</style>
