<script setup lang="ts">
import BottomNav from '@/components/BottomNav.vue'
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 pb-20 md:pb-0">
    <div class="max-w-6xl mx-auto px-4 md:px-6">
      <slot />
      <Footer />
    </div>
    <BottomNav />
  </main>
</template>
