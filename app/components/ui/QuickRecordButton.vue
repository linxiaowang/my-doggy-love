<template>
  <button class="fixed right-4 bottom-20 md:bottom-6 z-20 px-5 py-3 rounded-full bg-gradient-to-r from-#f0e9e2 to-#e6dfd8 text-#333 font-medium shadow-md hover:shadow-lg hover:from-#e6dfd8 hover:to-#ddd6cf active:scale-95 transition-all duration-200 ease-out animate-bounce-in" @click="$emit('click')">
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


