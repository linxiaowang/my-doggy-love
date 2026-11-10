<script setup lang="ts">
import type { LineDogScene } from '@/constants/lineDogStickers'

const route = useRoute()
const { isAuthenticated } = useAuth()

const navItems: Array<{
  name: string
  path: string
  scene: LineDogScene
  ariaLabel: string
}> = [
  { name: '首页', path: '/', scene: 'nav-home', ariaLabel: '首页' },
  { name: '日常', path: '/daily', scene: 'nav-daily', ariaLabel: '日常动态' },
  { name: '愿望', path: '/wishes', scene: 'nav-wishes', ariaLabel: '愿望清单' },
  { name: '留言', path: '/messages', scene: 'nav-messages', ariaLabel: '留言板' },
  { name: 'AI', path: '/chat', scene: 'nav-chat', ariaLabel: 'AI聊天' },
]

function isActive(path: string) {
  if (path === '/')
    return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav
    v-if="isAuthenticated"
    class="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)] z-50 md:hidden"
    role="navigation"
    aria-label="主导航"
  >
    <div class="flex justify-around items-center h-16 px-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="relative flex flex-col items-center justify-center w-full h-full gap-0.5 transition-all duration-300"
        :class="isActive(item.path) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
        :aria-label="item.ariaLabel"
        :aria-current="isActive(item.path) ? 'page' : undefined"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="scale-50 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-50 opacity-0"
        >
          <LineDogSticker
            v-if="isActive(item.path)"
            :scene="item.scene"
            size="xs"
            class="!w-9 !h-9 animate-bounce-in"
          />
          <span
            v-else
            class="w-9 h-9 rounded-xl bg-muted/80 border border-border/60 flex items-center justify-center text-[11px] font-display"
          >
            {{ item.name.slice(0, 1) }}
          </span>
        </Transition>
        <span
          class="text-[10px] font-medium transition-colors duration-300"
          :class="isActive(item.path) ? 'text-[var(--heart)]' : ''"
        >
          {{ item.name }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>
