<script setup lang="ts">
const route = useRoute()
const { isAuthenticated } = useAuth()

const navItems = [
  { name: '首页', path: '/', icon: 'home', ariaLabel: '首页' },
  { name: '日常', path: '/daily', icon: 'image', ariaLabel: '日常动态' },
  { name: '愿望', path: '/wishes', icon: 'star', ariaLabel: '愿望清单' },
  { name: '留言', path: '/messages', icon: 'message-circle', ariaLabel: '留言板' },
  { name: '我的', path: '/user/profile', icon: 'user', ariaLabel: '个人中心' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

// Icon SVG paths
const icons: Record<string, string> = {
  'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  'image': 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 15V3',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'message-circle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'user': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'
}
</script>

<template>
  <nav
    v-if="isAuthenticated"
    class="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)] z-50 md:hidden"
    role="navigation"
    aria-label="主导航"
  >
    <div class="flex justify-around items-center h-16 px-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 group"
        :class="isActive(item.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
        :aria-label="item.ariaLabel"
        :aria-current="isActive(item.path) ? 'page' : undefined"
      >
        <!-- Active Background -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="scale-0 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-0 opacity-0"
        >
          <div
            v-if="isActive(item.path)"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/10 rounded-2xl -z-10"
          />
        </Transition>

        <svg
          class="w-6 h-6 transition-transform duration-300"
          :class="isActive(item.path) ? 'scale-110' : ''"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path :d="icons[item.icon]" />
        </svg>
        <span class="text-[10px] font-medium transition-colors duration-300">{{ item.name }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
