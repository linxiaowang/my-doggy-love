<script setup lang="ts">
const route = useRoute()
const { isAuthenticated } = useAuth()

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
  <nav v-if="isAuthenticated" class="fixed bottom-0 left-0 right-0 glass pb-[env(safe-area-inset-bottom)] z-50 md:hidden animate-slide-up">
    <div class="flex justify-around items-center h-16 px-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300"
        :class="isActive(item.path) ? 'text-text-main' : 'text-text-muted hover:text-text-secondary'"
      >
        <!-- Active Pill Background -->
        <div 
          v-if="isActive(item.path)"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary-200 rounded-2xl -z-10 animate-fade-in"
        />
        
        <div :class="[item.icon, isActive(item.path) ? 'text-xl scale-110' : 'text-xl']" class="transition-transform duration-300" />
        <span class="text-[10px] font-medium transition-colors duration-300">{{ item.name }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>


