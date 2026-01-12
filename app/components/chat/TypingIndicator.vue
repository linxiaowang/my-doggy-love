<template>
  <div class="flex items-center gap-1 px-1 py-2">
    <span
      v-for="i in 3"
      :key="i"
      class="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
      :style="{ animationDelay: `${i * 150}ms` }"
    />
  </div>
</template>
