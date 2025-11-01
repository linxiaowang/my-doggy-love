<template>
  <button class="fixed right-4 bottom-20 md:bottom-6 z-20 px-4 py-2 rounded-full bg-#f0e9e2 text-#333 shadow hover:bg-#e7dfd7" @click="$emit('click')">
    快速记录
  </button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>()
</script>


