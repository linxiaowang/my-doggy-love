<template>
  <button
    class="fixed right-4 bottom-20 md:bottom-6 z-20 px-5 py-3 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 text-amber-900 dark:text-amber-100 font-medium shadow-lg hover:shadow-xl hover:from-amber-100 hover:to-amber-200 dark:hover:from-amber-900/40 dark:hover:to-amber-800/40 active:scale-95 transition-all duration-200 ease-out border border-amber-200/50 dark:border-amber-700/50"
    @click="$emit('click')"
    aria-label="快速记录"
  >
    <span class="flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span>快速记录</span>
    </span>
  </button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>()
</script>
