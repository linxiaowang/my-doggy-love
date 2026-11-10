<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  for?: string
  htmlFor?: string
  class?: HTMLAttributes['class']
}>()

const forId = computed(() => props.htmlFor ?? props.for)

function onMouseDown(event: MouseEvent) {
  // 与 reka-ui Label 一致：避免双击选中文字时抢焦点
  if (!event.defaultPrevented && event.detail > 1)
    event.preventDefault()
}
</script>

<template>
  <label
    data-slot="label"
    :for="forId"
    :class="
      cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        props.class,
      )
    "
    @mousedown="onMouseDown"
  >
    <slot />
  </label>
</template>
