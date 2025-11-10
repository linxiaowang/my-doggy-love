<template>
  <div class="space-y-4">
    <div v-for="i in count" :key="i" class="card animate-pulse">
      <div class="h-4 w-32 bg-gradient-to-r from-#f0f0f0 via-#e8e8e8 to-#f0f0f0 rounded mb-3"></div>
      <div class="h-3 w-full bg-gradient-to-r from-#f0f0f0 via-#e8e8e8 to-#f0f0f0 rounded mb-2"></div>
      <div class="h-3 w-5/6 bg-gradient-to-r from-#f0f0f0 via-#e8e8e8 to-#f0f0f0 rounded"></div>
      <div class="grid grid-cols-3 gap-2 mt-3">
        <div class="h-24 bg-gradient-to-r from-#f5f5f5 via-#eeeeee to-#f5f5f5 rounded-lg" />
        <div class="h-24 bg-gradient-to-r from-#f5f5f5 via-#eeeeee to-#f5f5f5 rounded-lg" />
        <div class="h-24 bg-gradient-to-r from-#f5f5f5 via-#eeeeee to-#f5f5f5 rounded-lg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 3 })
</script>


