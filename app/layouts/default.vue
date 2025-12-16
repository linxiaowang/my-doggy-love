<script setup lang="ts">
import BottomNav from '@/components/BottomNav.vue'
import Toast from '@/components/Toast.vue'
</script>

<template>
  <main class="min-h-screen bg-[linear-gradient(180deg,_#f7f6f3,_#f4f2ef)] pb-20 md:pb-0">
    <div class="max-w-6xl mx-auto px-4 md:px-6">
      <slot />
      <Footer />
    </div>
    <BottomNav />
    <Toast />
  </main>
</template>
