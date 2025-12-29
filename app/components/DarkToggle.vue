<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#0f172a' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}

const isDark = computed(() => color.value === 'dark')
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    class="relative w-8 h-8 hover:bg-muted/50"
    @click="toggleDark"
    :aria-label="isDark ? '切换到亮色模式' : '切换到暗黑模式'"
  >
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="rotate-90 scale-0 opacity-0"
      enter-to-class="rotate-0 scale-100 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="rotate-0 scale-100 opacity-100"
      leave-to-class="-rotate-90 scale-0 opacity-0"
      mode="out-in"
    >
      <svg
        v-if="isDark"
        key="moon"
        class="w-5 h-5 text-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      <svg
        v-else
        key="sun"
        class="w-5 h-5 text-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </transition>
  </Button>
</template>
