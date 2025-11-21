<script setup lang="ts">
const route = useRoute()

const navItems = [
  { name: '首页', path: '/', icon: 'i-carbon-home' },
  { name: '日常', path: '/daily', icon: 'i-carbon-image' },
  { name: '愿望', path: '/wishes', icon: 'i-carbon-star' },
  { name: '留言', path: '/messages', icon: 'i-carbon-chat' },
  { name: '我的', path: '/user/profile', icon: 'i-carbon-user' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-50 md:hidden">
    <div class="flex justify-around items-center h-16">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 transition-colors duration-200"
        :class="{ 'text-primary-500': isActive(item.path) }"
      >
        <div :class="[item.icon, isActive(item.path) ? 'text-xl' : 'text-xl']" />
        <span class="text-[10px] font-medium">{{ item.name }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.router-link-active {
  @apply text-primary-600;
}
</style>
