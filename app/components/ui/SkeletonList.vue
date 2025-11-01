<template>
  <div class="space-y-4">
    <div v-for="i in count" :key="i" class="card animate-pulse">
      <div class="h-4 w-32 bg-#eee rounded mb-3"></div>
      <div class="h-3 w-full bg-#eee rounded mb-2"></div>
      <div class="h-3 w-5/6 bg-#eee rounded"></div>
      <div class="grid grid-cols-3 gap-2 mt-3">
        <div class="h-24 bg-#f0f0f0 rounded" />
        <div class="h-24 bg-#f0f0f0 rounded" />
        <div class="h-24 bg-#f0f0f0 rounded" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 3 })
</script>


